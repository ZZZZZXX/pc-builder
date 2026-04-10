const fallbackOwner = "ZZZZZXX";
const fallbackRepo = "pc-builder";

const owner = process.env.GITHUB_REPOSITORY?.split("/")[0] ?? fallbackOwner;
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? fallbackRepo;

export const sitePath = repoName && !repoName.endsWith(".github.io") ? `/${repoName}` : "";

const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
export const siteUrl = explicitSiteUrl || `https://${owner.toLowerCase()}.github.io${sitePath}`;

export const siteName = "Rig Atlas";
export const siteTitle = "Rig Atlas | PC 装机模拟器与主机配件价格对比";
export const siteDescription =
  "Rig Atlas 是一个可公开访问的 DIY 装机网站，支持按品牌浏览 CPU、主板、显卡、内存、SSD、散热器、电源和机箱，并查看 Amazon、Joybuy、AliExpress、Best Buy 与品牌商城价格快照。";
export const googleSiteVerification = "googlee174b10c73ff7c66.html";

export const defaultKeywords = [
  "PC 装机",
  "DIY 装机",
  "电脑主机配件",
  "主机配件比价",
  "PC builder",
  "PC parts price comparison",
  "CPU",
  "GPU",
  "主板",
  "显卡价格",
];
