import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const dataPath = path.join(process.cwd(), "src", "data", "live-prices.json");

const currencySymbol = {
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const fetchHtml = async (url) => {
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      pragma: "no-cache",
      "cache-control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
};

const extractMetaPrice = (html) => {
  const currency =
    html.match(/(?:property|name)=["']product:price:currency["']\s+content=["']([A-Z]{3})["']/i)?.[1] ??
    html.match(/"priceCurrency"\s*:\s*"([A-Z]{3})"/i)?.[1];

  const price =
    html.match(/(?:property|name)=["']product:price:amount["']\s+content=["']([0-9]+(?:\.[0-9]+)?)["']/i)?.[1] ??
    html.match(/"price"\s*:\s*"([0-9]+(?:\.[0-9]+)?)"\s*,\s*"priceCurrency"/i)?.[1] ??
    html.match(/"priceCurrency"\s*:\s*"[A-Z]{3}"\s*,\s*"price"\s*:\s*"([0-9]+(?:\.[0-9]+)?)"/i)?.[1];

  if (!price || !currency) {
    return null;
  }

  return { price: Number(price), currency };
};

const extractPrice = (html, fallbackCurrency) => {
  const meta = extractMetaPrice(html);
  if (meta) {
    return meta;
  }

  const symbol = currencySymbol[fallbackCurrency];
  const simpleMatch = symbol
    ? html.match(new RegExp(`${symbol.replace("$", "\\$")}\\s?([0-9]+(?:,[0-9]{3})*(?:\\.[0-9]+)?)`, "i"))
    : null;

  if (!simpleMatch) {
    return null;
  }

  return {
    price: Number(simpleMatch[1].replaceAll(",", "")),
    currency: fallbackCurrency,
  };
};

const sourceLabel = (url) => {
  if (url.includes("joybuy.co.uk")) return "Joybuy 每日检查";
  if (url.includes("corsair.com")) return "Corsair 每日检查";
  if (url.includes("nzxt.com")) return "NZXT 每日检查";
  return "每日检查";
};

const raw = await readFile(dataPath, "utf8");
const feed = JSON.parse(raw);
const now = new Date().toISOString();

const results = [];

for (const [offerId, entry] of Object.entries(feed.offers)) {
  if (!entry.autoRefresh || !entry.url) {
    continue;
  }

  try {
    const html = await fetchHtml(entry.url);
    const parsed = extractPrice(html, entry.currency);

    if (!parsed) {
      throw new Error("No price found");
    }

    entry.price = parsed.price;
    entry.currency = parsed.currency;
    entry.checkedAt = now;
    entry.note = sourceLabel(entry.url);
    delete entry.lastError;
    results.push(`${offerId}: ${parsed.currency} ${parsed.price}`);
  } catch (error) {
    entry.checkedAt = now;
    entry.lastError = String(error);
    results.push(`${offerId}: failed (${String(error)})`);
  }
}

feed.lastCheckedAt = now;

await writeFile(dataPath, `${JSON.stringify(feed, null, 2)}\n`, "utf8");

console.log(`Updated live prices at ${now}`);
for (const line of results) {
  console.log(`- ${line}`);
}
