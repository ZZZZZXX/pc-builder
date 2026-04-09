"use client";

import { useState } from "react";
import livePrices from "@/data/live-prices.json";
import { defaultKeywords, siteDescription, siteName, siteUrl } from "@/lib/site";

type CategoryId = "cpu" | "motherboard" | "gpu" | "ram" | "ssd" | "cooler" | "psu" | "case";
type MarketId = "amazon" | "joybuy" | "aliexpress" | "bestbuy" | "official";

type Offer = {
  id: string;
  market: MarketId;
  title: string;
  price: number;
  currency: "USD" | "GBP" | "EUR";
  note: string;
  url: string;
};

type Part = {
  id: string;
  category: CategoryId;
  name: string;
  brand: string;
  summary: string;
  tags: string[];
  specs: Record<string, number | string | string[]>;
  offers: Offer[];
};

type Preset = {
  id: string;
  name: string;
  parts: Record<CategoryId, string>;
};

type LivePriceEntry = {
  price: number;
  currency: Offer["currency"];
  note: string;
  checkedAt: string;
  url: string;
  autoRefresh: boolean;
  lastError?: string;
};

const usdToGbp = 0.7465;
const eurToGbp = 0.8575;
const baseSnapshotDate = "2026-04-09";
const livePriceFeed = livePrices as { lastCheckedAt: string; offers: Record<string, LivePriceEntry> };
const snapshotDate = livePriceFeed.lastCheckedAt?.slice(0, 10) || baseSnapshotDate;

const marketMeta: Record<MarketId, { label: string; color: string }> = {
  amazon: { label: "Amazon", color: "#ffb703" },
  joybuy: { label: "Joybuy", color: "#8be0d2" },
  aliexpress: { label: "AliExpress", color: "#ff6b35" },
  bestbuy: { label: "Best Buy", color: "#7bd1ff" },
  official: { label: "品牌商城", color: "#8da9c4" },
};

const categories: { id: CategoryId; title: string; description: string }[] = [
  { id: "cpu", title: "处理器", description: "加入 AMD Ryzen 与 Intel Core / Core Ultra 主流 DIY CPU，覆盖游戏、创作和通用装机场景。" },
  { id: "motherboard", title: "主板", description: "补充 AM5、LGA1700、LGA1851 多平台主板，方便自由切换 AMD / Intel 方案。" },
  { id: "gpu", title: "显卡", description: "扩展 MSI、ASUS、Gigabyte、Palit、GALAX 等热门显卡型号，覆盖 1080p 到 4K 档位。" },
  { id: "ram", title: "内存", description: "补充 Corsair、Crucial、Kingston、G.SKILL 常用 DDR5 套条，兼顾性价比与灯效。" },
  { id: "ssd", title: "固态硬盘", description: "加入 Samsung、WD、Crucial、Lexar 等常见 NVMe SSD，包含 PCIe 4.0 与 Gen5 选项。" },
  { id: "cooler", title: "散热器", description: "同时提供 360 水冷与主流高颜值散热方案，并标注对 AM5、LGA1700、LGA1851 的支持情况。" },
  { id: "psu", title: "电源", description: "补足 550W 到 850W 电源段位，适合从入门到高性能显卡装机。" },
  { id: "case", title: "机箱", description: "加入 MSI、NZXT、Lian Li 等常用风道机箱，方便根据主板板型和显卡长度自由搭配。" },
];

const catalogParts: Part[] = [
  {
    id: "cpu-9600",
    category: "cpu",
    name: "Ryzen 5 9600",
    brand: "AMD",
    summary: "偏主流预算的 AM5 六核处理器，适合 1080p / 1440p 游戏装机。",
    tags: ["AM5", "6 核", "65W"],
    specs: { socket: "AM5", tdp: 65 },
    offers: [
      {
        id: "cpu-9600-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 199,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10040765",
      },
    ],
  },
  {
    id: "cpu-7800x3d",
    category: "cpu",
    name: "Ryzen 7 7800X3D",
    brand: "AMD",
    summary: "经典 8 核 16 线程游戏 CPU，仍然是高性价比热门选择。",
    tags: ["AM5", "8 核", "120W"],
    specs: { socket: "AM5", tdp: 120 },
    offers: [
      {
        id: "cpu-7800x3d-amazon",
        market: "amazon",
        title: "价格跟踪",
        price: 384,
        currency: "USD",
        note: "Camel 快照",
        url: "https://camelcamelcamel.com/popular?bn=electronics&deal=0&p=1",
      },
      {
        id: "cpu-7800x3d-aliexpress",
        market: "aliexpress",
        title: "平台快照",
        price: 323.96,
        currency: "USD",
        note: "PriceArchive",
        url: "https://no.pricearchive.org/aliexpress.com/item/1005009732232580",
      },
    ],
  },
  {
    id: "cpu-9700x",
    category: "cpu",
    name: "Ryzen 7 9700X",
    brand: "AMD",
    summary: "新一代 8 核 Ryzen，兼顾多任务、创作与高刷游戏。",
    tags: ["AM5", "8 核", "65W"],
    specs: { socket: "AM5", tdp: 65 },
    offers: [
      {
        id: "cpu-9700x-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 295.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10040779",
      },
    ],
  },
  {
    id: "cpu-9800x3d",
    category: "cpu",
    name: "Ryzen 7 9800X3D",
    brand: "AMD",
    summary: "更高阶的 X3D 游戏处理器，适合高端显卡搭配。",
    tags: ["AM5", "8 核", "高端"],
    specs: { socket: "AM5", tdp: 120 },
    offers: [
      {
        id: "cpu-9800x3d-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 419.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10040780",
      },
      {
        id: "cpu-9800x3d-amazon",
        market: "amazon",
        title: "价格跟踪",
        price: 419.95,
        currency: "USD",
        note: "Camel 快照",
        url: "https://camelcamelcamel.com/popular?deal=0",
      },
    ],
  },
  {
    id: "cpu-14600k",
    category: "cpu",
    name: "Core i5-14600K",
    brand: "Intel",
    summary: "热门 Intel 中高端装机处理器，适合游戏和直播混合需求。",
    tags: ["LGA1700", "14 核", "125W"],
    specs: { socket: "LGA1700", tdp: 125 },
    offers: [
      {
        id: "cpu-14600k-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 259.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/intel-core-i5-14600k-14th-gen-14-core-20-thread-4-0ghz-5-3ghz-turbo-socket-lga-1700-unlocked-desktop-processor-multi/JXZRJ55778/sku/6560423",
      },
    ],
  },
  {
    id: "cpu-265k",
    category: "cpu",
    name: "Core Ultra 7 265K",
    brand: "Intel",
    summary: "LGA1851 平台的高性能处理器，适合新平台尝鲜与生产力装机。",
    tags: ["LGA1851", "20 核", "125W"],
    specs: { socket: "LGA1851", tdp: 125 },
    offers: [
      {
        id: "cpu-265k-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 399.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/intel-core-ultra-7-265k-20-cores-20-threads-4-6ghz-5-5-ghz-turbo-socket-lga-1851-unlocked-desktop-processor-multi/JXZRJ5534X/sku/6602214",
      },
    ],
  },
  {
    id: "mobo-b650",
    category: "motherboard",
    name: "MAG B650 Tomahawk WIFI",
    brand: "MSI",
    summary: "AM5 平台里非常常见的 ATX 主板，适合均衡型装机。",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-b650-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 153.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-mag-b650-tomahawk-wifi-amd/10369430",
      },
    ],
  },
  {
    id: "mobo-b850",
    category: "motherboard",
    name: "B850 Gaming Plus WIFI6E",
    brand: "MSI",
    summary: "更偏新平台的 AM5 主板，适合 Ryzen 9000 系装机。",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-b850-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 129.98,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-b850-gaming-plus-wifi6e-moederbord/10368777",
      },
    ],
  },
  {
    id: "mobo-colorful-b650me",
    category: "motherboard",
    name: "BATTLE-AX B650M-E WIFI V14",
    brand: "Colorful",
    summary: "偏预算友好的 AM5 mATX 主板，适合压低整机成本。",
    tags: ["AM5", "mATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "mATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-colorful-b650me-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 99.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10038553",
      },
    ],
  },
  {
    id: "mobo-colorful-frozen",
    category: "motherboard",
    name: "CVN B650M GAMING FROZEN V14",
    brand: "Colorful",
    summary: "高颜值白色 AM5 主板，适合白色主题机箱搭配。",
    tags: ["AM5", "mATX", "DDR5", "White"],
    specs: { socket: "AM5", formFactor: "mATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-colorful-frozen-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 129.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10038549",
      },
    ],
  },
  {
    id: "mobo-z790",
    category: "motherboard",
    name: "Z790 Gaming Plus WIFI",
    brand: "MSI",
    summary: "LGA1700 常用 DDR5 主板，适合搭配 i5-14600K 等 Intel 热门 CPU。",
    tags: ["LGA1700", "ATX", "DDR5"],
    specs: { socket: "LGA1700", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-z790-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 189.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/msi-z790-gaming-plus-wifi-socket-lga-1700-intel-z790-atx-ddr5-wi-fi-6e-motherboard-black/10734966.p?skuId=10734966",
      },
    ],
  },
  {
    id: "mobo-b860",
    category: "motherboard",
    name: "B860M Gaming X WIFI6E DDR5",
    brand: "Gigabyte",
    summary: "适合 Core Ultra 平台的 mATX 主板，适合较新的 Intel DIY 配置。",
    tags: ["LGA1851", "mATX", "DDR5"],
    specs: { socket: "LGA1851", formFactor: "mATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-b860-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 185,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10369387",
      },
    ],
  },
  {
    id: "gpu-5060-msi",
    category: "gpu",
    name: "GeForce RTX 5060 8G VENTUS 2X OC",
    brand: "MSI",
    summary: "主流 1080p / 1440p 双风扇显卡，适合平衡型整机。",
    tags: ["8GB", "145W", "双风扇"],
    specs: { boardPower: 145, lengthMm: 227 },
    offers: [
      {
        id: "gpu-5060-msi-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 259.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-geforce-rtx-5060-8g-ventus/10369534",
      },
    ],
  },
  {
    id: "gpu-5060ti-galax",
    category: "gpu",
    name: "RTX 5060 Ti 8GB 二手渠道价",
    brand: "GALAX",
    summary: "用于对比二手价格区间，适合预算敏感型装机参考。",
    tags: ["8GB", "180W", "二手"],
    specs: { boardPower: 180, lengthMm: 250 },
    offers: [
      {
        id: "gpu-5060ti-galax-aliexpress",
        market: "aliexpress",
        title: "平台快照",
        price: 230.12,
        currency: "USD",
        note: "PriceArchive",
        url: "https://www.pricearchive.org/aliexpress.com/item/1005009678410256",
      },
    ],
  },
  {
    id: "gpu-5060-palit",
    category: "gpu",
    name: "GeForce RTX 5060 Dual 8GB GDDR7",
    brand: "Palit",
    summary: "又一个常见的入门新卡选择，适合预算型游戏主机。",
    tags: ["8GB", "145W", "Dual"],
    specs: { boardPower: 145, lengthMm: 249 },
    offers: [
      {
        id: "gpu-5060-palit-joybuy",
        market: "joybuy",
        title: "活动快照",
        price: 291.99,
        currency: "GBP",
        note: "Joybuy 活动页",
        url: "https://www.joybuy.co.uk/cms/unleash-the-ultimate-gaming-power",
      },
    ],
  },
  {
    id: "gpu-5070-gigabyte",
    category: "gpu",
    name: "GeForce RTX 5070 WINDFORCE OC SFF 12G",
    brand: "Gigabyte",
    summary: "更适合 1440p 高画质的热门显卡，长度控制也更友好。",
    tags: ["12GB", "250W", "SFF"],
    specs: { boardPower: 250, lengthMm: 282 },
    offers: [
      {
        id: "gpu-5070-gigabyte-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 508.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10425580",
      },
    ],
  },
  {
    id: "gpu-5070-msi",
    category: "gpu",
    name: "GeForce RTX 5070 12G GAMING TRIO OC",
    brand: "MSI",
    summary: "面向中高端 1440p / 4K 的三风扇显卡，适合高性能整机。",
    tags: ["12GB", "250W", "三风扇"],
    specs: { boardPower: 250, lengthMm: 338 },
    offers: [
      {
        id: "gpu-5070-msi-joybuy",
        market: "joybuy",
        title: "活动快照",
        price: 655,
        currency: "GBP",
        note: "Joybuy 活动页",
        url: "https://www.joybuy.co.uk/cms/unleash-the-ultimate-gaming-power",
      },
    ],
  },
  {
    id: "gpu-5070ti-asus",
    category: "gpu",
    name: "TUF Gaming GeForce RTX 5070 Ti OC 16GB",
    brand: "ASUS",
    summary: "更高一档的 16GB 显卡，适合高端 1440p 和 4K 游戏主机。",
    tags: ["16GB", "300W", "TUF"],
    specs: { boardPower: 300, lengthMm: 329 },
    offers: [
      {
        id: "gpu-5070ti-asus-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 1037.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/asus-tuf-gaming-nvidia-geforce-rtx-5070-ti-oc-edition-16gb-gddr7-pci-express-5-0-graphics-card-black/6614743/openbox",
      },
    ],
  },
  {
    id: "ram-crucial",
    category: "ram",
    name: "Crucial Pro DDR5 32GB 6000",
    brand: "Crucial",
    summary: "偏性价比的 32GB DDR5 套条，适合预算优先方案。",
    tags: ["32GB", "DDR5-6000"],
    specs: { memoryType: "DDR5" },
    offers: [
      {
        id: "ram-crucial-aliexpress",
        market: "aliexpress",
        title: "平台快照",
        price: 53.79,
        currency: "USD",
        note: "PriceArchive",
        url: "https://www.pricearchive.org/aliexpress.com/item/1005009608027098",
      },
    ],
  },
  {
    id: "ram-corsair",
    category: "ram",
    name: "Vengeance RGB DDR5 32GB 6000",
    brand: "Corsair",
    summary: "非常常见的主流 RGB 内存，适合高颜值装机。",
    tags: ["32GB", "DDR5-6000", "RGB"],
    specs: { memoryType: "DDR5" },
    offers: [
      {
        id: "ram-corsair-official",
        market: "official",
        title: "品牌商城价",
        price: 436.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/memory/cmh32gx5m2b6000c40/vengeance-rgb-32gb-2x16gb-ddr5-dram-6000mhz-c40-memory-kit-black-cmh32gx5m2b6000c40",
      },
    ],
  },
  {
    id: "ram-kingston",
    category: "ram",
    name: "FURY Beast RGB DDR5 32GB 6000",
    brand: "Kingston",
    summary: "常见的游戏装机 RGB 套条，适合 Intel / AMD 双平台。",
    tags: ["32GB", "DDR5-6000", "RGB"],
    specs: { memoryType: "DDR5" },
    offers: [
      {
        id: "ram-kingston-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 474.21,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/kingston-fury-beast-32gb-2x16gb-6000mt-s-ddr5-cl30-rgb-expo-dimm-desktop-memory-black/JCKR7VQLZ2/sku/6593818",
      },
    ],
  },
  {
    id: "ram-gskill",
    category: "ram",
    name: "Trident Z5 Neo RGB DDR5 32GB 6000",
    brand: "G.SKILL",
    summary: "热门高端 RGB 内存，常用于 Ryzen 高性能整机。",
    tags: ["32GB", "DDR5-6000", "EXPO"],
    specs: { memoryType: "DDR5" },
    offers: [
      {
        id: "ram-gskill-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 538.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/g-skill-trident-z5-neo-rgb-ddr5-6000-32gb-2x16gb-amd-expo-ram-black/J36V4SLWGX/sku/11247645",
      },
    ],
  },
  {
    id: "ssd-990pro",
    category: "ssd",
    name: "990 PRO 1TB",
    brand: "Samsung",
    summary: "经典高性能 PCIe 4.0 SSD，适合游戏和系统盘。",
    tags: ["1TB", "PCIe 4.0"],
    specs: { capacityTb: 1 },
    offers: [
      {
        id: "ssd-990pro-amazon",
        market: "amazon",
        title: "价格跟踪",
        price: 199.99,
        currency: "USD",
        note: "Camel 快照",
        url: "https://camelcamelcamel.com/popular?bn=electronics&deal=0&p=1",
      },
    ],
  },
  {
    id: "ssd-t500",
    category: "ssd",
    name: "T500 2TB",
    brand: "Crucial",
    summary: "热门 2TB PCIe 4.0 SSD，适合游戏库与大型项目文件。",
    tags: ["2TB", "PCIe 4.0"],
    specs: { capacityTb: 2 },
    offers: [
      {
        id: "ssd-t500-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 244.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/crucial-t500-2tb-internal-ssd-pcie-gen-4x4-nvme-m-2/JX8PSKCCKY/sku/6566097",
      },
    ],
  },
  {
    id: "ssd-sn850x",
    category: "ssd",
    name: "WD_BLACK SN850X 2TB",
    brand: "Western Digital",
    summary: "游戏装机里很常见的 2TB NVMe SSD，兼顾容量和高速读写。",
    tags: ["2TB", "PCIe 4.0"],
    specs: { capacityTb: 2 },
    offers: [
      {
        id: "ssd-sn850x-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 369.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=wd_black+sn850x+2tb",
      },
    ],
  },
  {
    id: "ssd-arespro",
    category: "ssd",
    name: "ARES PRO 2TB Gen5 NVMe",
    brand: "Lexar",
    summary: "更偏高端的 Gen5 SSD，适合追求极限顺序速度的配置。",
    tags: ["2TB", "Gen5"],
    specs: { capacityTb: 2 },
    offers: [
      {
        id: "ssd-arespro-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 249.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/lexar-ares-pro-2tb-gen5-nvme/10498802",
      },
    ],
  },
  {
    id: "cooler-msi",
    category: "cooler",
    name: "MAG CoreLiquid I360",
    brand: "MSI",
    summary: "常见 360 一体式水冷，适合高性能显卡 + 高功耗 CPU 装机。",
    tags: ["360 水冷", "ARGB"],
    specs: { supportedSockets: ["AM5", "LGA1700", "LGA1851"], radiatorMm: 360 },
    offers: [
      {
        id: "cooler-msi-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 94.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-mag-coreliquid-i360-computer-case/10368873",
      },
    ],
  },
  {
    id: "cooler-thermalright",
    category: "cooler",
    name: "Levita Vision 360",
    brand: "Thermalright",
    summary: "提供 AliExpress 平台的 360 水冷价格参考，适合白色 / 海景机箱装机。",
    tags: ["360 水冷", "LCD"],
    specs: { supportedSockets: ["AM5", "LGA1700"], radiatorMm: 360 },
    offers: [
      {
        id: "cooler-thermalright-aliexpress",
        market: "aliexpress",
        title: "平台快照",
        price: 256.63,
        currency: "USD",
        note: "PriceArchive",
        url: "https://ms.pricearchive.org/aliexpress.com/item/1005010588582324",
      },
    ],
  },
  {
    id: "cooler-corsair",
    category: "cooler",
    name: "iCUE LINK H150i RGB",
    brand: "Corsair",
    summary: "高端 360 水冷，适合主题灯效和中高端 Intel / AMD 平台。",
    tags: ["360 水冷", "RGB"],
    specs: { supportedSockets: ["AM5", "LGA1700", "LGA1851"], radiatorMm: 360 },
    offers: [
      {
        id: "cooler-corsair-official",
        market: "official",
        title: "品牌商城价",
        price: 239.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/cpu-coolers/cw-9061008-ww/icue-link-h150i-rgb-liquid-cpu-cooler-cw-9061008-ww",
      },
    ],
  },
  {
    id: "cooler-nzxt",
    category: "cooler",
    name: "Kraken 360 RGB",
    brand: "NZXT",
    summary: "常见高颜值 360 水冷，适合高端展示型机箱。",
    tags: ["360 水冷", "LCD", "RGB"],
    specs: { supportedSockets: ["AM5", "LGA1700", "LGA1851"], radiatorMm: 360 },
    offers: [
      {
        id: "cooler-nzxt-official",
        market: "official",
        title: "品牌商城价",
        price: 219.99,
        currency: "USD",
        note: "NZXT 官方",
        url: "https://nzxt.com/en-US/product/kraken-360-rgb",
      },
    ],
  },
  {
    id: "psu-550",
    category: "psu",
    name: "MAG A550BN",
    brand: "MSI",
    summary: "入门装机常用 550W 电源，适合预算型中低功耗显卡方案。",
    tags: ["550W", "80 Plus"],
    specs: { wattage: 550 },
    offers: [
      {
        id: "psu-550-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 44.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-550w-atx-standard-power-supply/10368857",
      },
    ],
  },
  {
    id: "psu-650",
    category: "psu",
    name: "MAG A650GL",
    brand: "MSI",
    summary: "主流中端整机常见 650W 全模组电源。",
    tags: ["650W", "全模组"],
    specs: { wattage: 650 },
    offers: [
      {
        id: "psu-650-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 69.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-650w-atx-fully-modular-power/10369658",
      },
    ],
  },
  {
    id: "psu-750",
    category: "psu",
    name: "MAG A750GL PCIE5",
    brand: "MSI",
    summary: "搭配 RTX 5070 级显卡较稳妥的 750W 选择。",
    tags: ["750W", "ATX 3.0"],
    specs: { wattage: 750 },
    offers: [
      {
        id: "psu-750-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 99.98,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-750w-atx-fully-modular-power/10368859",
      },
    ],
  },
  {
    id: "psu-850-white",
    category: "psu",
    name: "MAG A850GL PCIE5 WHITE",
    brand: "MSI",
    summary: "适合白色主题机箱和高端显卡方案的 850W 电源。",
    tags: ["850W", "ATX 3.0", "White"],
    specs: { wattage: 850 },
    offers: [
      {
        id: "psu-850-white-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 109.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-850w-atx-fully-modular-power/10368861",
      },
    ],
  },
  {
    id: "psu-rm850e",
    category: "psu",
    name: "RM850e",
    brand: "Corsair",
    summary: "Corsair 热门 850W 电源，适合高性能 Intel / AMD 配置。",
    tags: ["850W", "ATX 3.1"],
    specs: { wattage: 850 },
    offers: [
      {
        id: "psu-rm850e-official",
        market: "official",
        title: "品牌商城价",
        price: 124.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/psu/cp-9020296-na/rme-series-rm850e-fully-modular-low-noise-atx-power-supply-cp-9020296-na",
      },
    ],
  },
  {
    id: "case-forge",
    category: "case",
    name: "MAG Forge 120A Airflow",
    brand: "MSI",
    summary: "主流入门风道机箱，适合预算型 ATX / mATX DIY 装机。",
    tags: ["ATX", "风道"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 330, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-forge-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 47.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/msi-mag-forge-120a-airflow-midi/10369706",
      },
    ],
  },
  {
    id: "case-velox",
    category: "case",
    name: "VELox 300R Airflow PZ",
    brand: "MSI",
    summary: "更适合高端显卡和 360 水冷的中塔风道机箱。",
    tags: ["ATX", "高风道", "360 水冷"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 400, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-velox-joybuy",
        market: "joybuy",
        title: "现货快照",
        price: 99.99,
        currency: "GBP",
        note: "Joybuy UK",
        url: "https://www.joybuy.co.uk/dp/10369056",
      },
    ],
  },
  {
    id: "case-h5",
    category: "case",
    name: "H5 Flow",
    brand: "NZXT",
    summary: "热门高风道中塔机箱，适合绝大多数主流装机。",
    tags: ["ATX", "高风道"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 365, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-h5-official",
        market: "official",
        title: "品牌商城价",
        price: 74.99,
        currency: "USD",
        note: "NZXT 官方",
        url: "https://nzxt.com/en-US/product/h5-flow",
      },
    ],
  },
  {
    id: "case-h7",
    category: "case",
    name: "H7 Flow",
    brand: "NZXT",
    summary: "更大空间的高风道机箱，适合长显卡与多风扇方案。",
    tags: ["ATX", "高风道", "中高端"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 410, maxRadiatorMm: 420 },
    offers: [
      {
        id: "case-h7-official",
        market: "official",
        title: "品牌商城价",
        price: 129.99,
        currency: "USD",
        note: "NZXT 官方",
        url: "https://nzxt.com/en-US/product/h7-flow",
      },
    ],
  },
  {
    id: "case-lancool216",
    category: "case",
    name: "LANCOOL 216",
    brand: "Lian Li",
    summary: "DIY 圈里很常见的风道机箱，适合高性能显卡和大尺寸风扇。",
    tags: ["ATX", "风道", "双大风扇"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 392, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-lancool216-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 99.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=lian+li+lancool+216",
      },
    ],
  },
];

const extraParts: Part[] = [
  {
    id: "cpu-7600x",
    category: "cpu",
    name: "Ryzen 5 7600X",
    brand: "AMD",
    summary: "热门六核 AM5 处理器，适合强调性价比的游戏装机。",
    tags: ["AM5", "6 核", "105W"],
    specs: { socket: "AM5", tdp: 105 },
    offers: [
      {
        id: "cpu-7600x-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 190.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=amd+ryzen+5+7600x",
      },
    ],
  },
  {
    id: "cpu-14700k",
    category: "cpu",
    name: "Core i7-14700K",
    brand: "Intel",
    summary: "高性能游戏与创作处理器，适合更高阶的 Intel 平台装机。",
    tags: ["LGA1700", "20 核", "125W"],
    specs: { socket: "LGA1700", tdp: 125 },
    offers: [
      {
        id: "cpu-14700k-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 403.74,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/intel-core-i7-14700k-14th-gen-20-core-28-thread-4-3ghz-5-6ghz-turbo-socket-lga-1700-unlocked-desktop-processor-multi/JXZRJ557C2/sku/11232138",
      },
    ],
  },
  {
    id: "cpu-9900x",
    category: "cpu",
    name: "Ryzen 9 9900X",
    brand: "AMD",
    summary: "面向高端创作和多任务的 12 核处理器，适合旗舰级整机。",
    tags: ["AM5", "12 核", "120W"],
    specs: { socket: "AM5", tdp: 120 },
    offers: [
      {
        id: "cpu-9900x-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 439,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/product/amd-ryzen-9-9900x-12-core-24-thread-4-4-ghz-5-6-ghz-max-boost-socket-am5-120w-unlocked-desktop-processor-silver/JXKQHH5XS4",
      },
    ],
  },
  {
    id: "mobo-b650-aorus",
    category: "motherboard",
    name: "B650 AORUS ELITE AX",
    brand: "Gigabyte",
    summary: "热门 AM5 ATX 主板，适合 Ryzen 中高端装机。",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-b650-aorus-bestbuy",
        market: "bestbuy",
        title: "当前在售",
        price: 149.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/gigabyte-b650-aorus-elite-ax-socket-am5-amd-b650-atx-ddr5-wi-fi-6e-motherboard-black/6523178.p",
      },
    ],
  },
  {
    id: "gpu-rx9060xt",
    category: "gpu",
    name: "RX 9060 XT 16GB GAMING OC",
    brand: "Gigabyte",
    summary: "主流 AMD 显卡选择，适合预算更灵活的 1440p 方案。",
    tags: ["16GB", "182W", "AMD"],
    specs: { boardPower: 182, lengthMm: 281 },
    offers: [
      {
        id: "gpu-rx9060xt-joybuy",
        market: "joybuy",
        title: "活动快照",
        price: 399,
        currency: "GBP",
        note: "Joybuy 活动页",
        url: "https://www.joybuy.co.uk/cms/unleash-the-ultimate-gaming-power",
      },
    ],
  },
  {
    id: "gpu-5080-msi",
    category: "gpu",
    name: "GeForce RTX 5080 16G GAMING TRIO OC",
    brand: "MSI",
    summary: "更高档的 4K 级显卡，适合旗舰装机。",
    tags: ["16GB", "360W", "旗舰"],
    specs: { boardPower: 360, lengthMm: 338 },
    offers: [
      {
        id: "gpu-5080-msi-joybuy",
        market: "joybuy",
        title: "活动快照",
        price: 1284.99,
        currency: "GBP",
        note: "Joybuy 活动页",
        url: "https://www.joybuy.co.uk/cms/unleash-the-ultimate-gaming-power",
      },
    ],
  },
  {
    id: "gpu-5080-asus",
    category: "gpu",
    name: "TUF-RTX 5080 O16G-GAMING",
    brand: "ASUS",
    summary: "高端 TUF 系列显卡，适合高性能与稳重风格整机。",
    tags: ["16GB", "360W", "TUF"],
    specs: { boardPower: 360, lengthMm: 348 },
    offers: [
      {
        id: "gpu-5080-asus-joybuy",
        market: "joybuy",
        title: "活动快照",
        price: 1419.99,
        currency: "GBP",
        note: "Joybuy 活动页",
        url: "https://www.joybuy.co.uk/cms/unleash-the-ultimate-gaming-power",
      },
    ],
  },
  {
    id: "ssd-mp600elite",
    category: "ssd",
    name: "MP600 ELITE 2TB",
    brand: "Corsair",
    summary: "Corsair 的主流 2TB PCIe 4.0 SSD，适合游戏库和日常创作。",
    tags: ["2TB", "PCIe 4.0"],
    specs: { capacityTb: 2 },
    offers: [
      {
        id: "ssd-mp600elite-official",
        market: "official",
        title: "品牌商城价",
        price: 439.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/data-storage/cssd-f2000gbmp600enh/mp600-elite-2tb-pcie-gen4-x4-nvme-1-4-m-2-ssd-cssd-f2000gbmp600enh",
      },
    ],
  },
  {
    id: "cooler-nautilus",
    category: "cooler",
    name: "NAUTILUS 360 RS ARGB",
    brand: "Corsair",
    summary: "更简洁的 Corsair 360 水冷，适合主流高性能装机。",
    tags: ["360 水冷", "ARGB"],
    specs: { supportedSockets: ["AM5", "LGA1700", "LGA1851"], radiatorMm: 360 },
    offers: [
      {
        id: "cooler-nautilus-official",
        market: "official",
        title: "品牌商城价",
        price: 129.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/cpu-coolers/cw-9060093-ww/nautilus-360-rs-argb-liquid-cpu-cooler-cw-9060093-ww",
      },
    ],
  },
  {
    id: "psu-rm750e",
    category: "psu",
    name: "RM750e",
    brand: "Corsair",
    summary: "热门 750W 电源，适合 RTX 5070 与主流高性能整机。",
    tags: ["750W", "ATX 3.1"],
    specs: { wattage: 750 },
    offers: [
      {
        id: "psu-rm750e-official",
        market: "official",
        title: "品牌商城价",
        price: 114.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/psu/cp-9020262-na/rme-series-rm750e-fully-modular-low-noise-atx-power-supply-cp-9020262-na",
      },
    ],
  },
  {
    id: "psu-rm1000e",
    category: "psu",
    name: "RM1000e",
    brand: "Corsair",
    summary: "为旗舰显卡和高功耗平台准备的 1000W 电源。",
    tags: ["1000W", "ATX 3.1"],
    specs: { wattage: 1000 },
    offers: [
      {
        id: "psu-rm1000e-official",
        market: "official",
        title: "品牌商城价",
        price: 189.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/psu/cp-9020250-na/rme-series-rm1000e-fully-modular-low-noise-atx-power-supply-cp-9020250-na",
      },
    ],
  },
  {
    id: "case-h6",
    category: "case",
    name: "H6 Flow",
    brand: "NZXT",
    summary: "双仓结构风道机箱，适合展示型装机与更强的显卡散热。",
    tags: ["ATX", "双仓", "高风道"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 365, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-h6-official",
        market: "official",
        title: "品牌商城价",
        price: 99.99,
        currency: "USD",
        note: "NZXT 官方",
        url: "https://nzxt.com/en-US/product/h6-flow",
      },
    ],
  },
  {
    id: "case-h9",
    category: "case",
    name: "H9 Flow",
    brand: "NZXT",
    summary: "更大的双仓全景机箱，适合旗舰散热和展示型整机。",
    tags: ["ATX", "双仓", "旗舰"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 435, maxRadiatorMm: 420 },
    offers: [
      {
        id: "case-h9-official",
        market: "official",
        title: "品牌商城价",
        price: 119.99,
        currency: "USD",
        note: "NZXT 官方",
        url: "https://nzxt.com/en-US/product/h9-flow",
      },
    ],
  },
  {
    id: "case-3500x",
    category: "case",
    name: "3500X ARGB",
    brand: "Corsair",
    summary: "玻璃展示型机箱，适合白色主题与高颜值 RGB 装机。",
    tags: ["ATX", "ARGB", "海景"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 410, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-3500x-official",
        market: "official",
        title: "品牌商城价",
        price: 119.99,
        currency: "USD",
        note: "Corsair 官方",
        url: "https://www.corsair.com/us/en/p/pc-cases/cc-9011278-ww/3500x-argb-mid-tower-pc-case-cc-9011278-ww",
      },
    ],
  },
  {
    id: "mobo-b650-steellegend",
    category: "motherboard",
    name: "B650 Steel Legend WiFi",
    brand: "ASRock",
    summary: "AM5 white-silver ATX motherboard for clean mid-range gaming and creator builds.",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-b650-steellegend-newegg",
        market: "amazon",
        title: "market snapshot",
        price: 189.99,
        currency: "USD",
        note: "ASRock market snapshot",
        url: "https://www.asrock.com/mb/AMD/B650%20Steel%20Legend%20WiFi/",
      },
    ],
  },
  {
    id: "mobo-b650-tufplus",
    category: "motherboard",
    name: "TUF Gaming B650-PLUS WIFI",
    brand: "ASUS",
    summary: "Balanced AM5 ATX motherboard with strong power delivery and stable BIOS support.",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-b650-tufplus-bestbuy",
        market: "bestbuy",
        title: "current listing",
        price: 219.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/searchpage.jsp?st=TUF+Gaming+B650-PLUS+WIFI",
      },
    ],
  },
  {
    id: "mobo-x870-eagle",
    category: "motherboard",
    name: "X870 Eagle WIFI7",
    brand: "Gigabyte",
    summary: "New-gen AM5 board for faster networking, higher memory ceilings, and premium builds.",
    tags: ["AM5", "ATX", "WiFi 7"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-x870-eagle-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 249.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=X870+Eagle+WIFI7",
      },
    ],
  },
  {
    id: "mobo-z890-pro-rs",
    category: "motherboard",
    name: "Z890 Pro RS WiFi",
    brand: "ASRock",
    summary: "Intel Core Ultra platform board aimed at creator and high-core desktop builds.",
    tags: ["LGA1851", "ATX", "DDR5"],
    specs: { socket: "LGA1851", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-z890-pro-rs-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 239.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Z890+Pro+RS+WiFi",
      },
    ],
  },
  {
    id: "gpu-7800xt-sapphire",
    category: "gpu",
    name: "Radeon RX 7800 XT Pulse",
    brand: "Sapphire",
    summary: "Trusted 1440p Radeon choice with strong raster performance and a quiet cooler.",
    tags: ["1440p", "16GB", "AMD"],
    specs: { performanceTier: "high", vramGb: 16, powerDraw: 263 },
    offers: [
      {
        id: "gpu-7800xt-sapphire-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 499.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Sapphire+RX+7800+XT+Pulse",
      },
    ],
  },
  {
    id: "gpu-9070xt-xfx",
    category: "gpu",
    name: "Radeon RX 9070 XT MERC",
    brand: "XFX",
    summary: "High-end Radeon option for strong 1440p ultra and entry-level 4K gaming.",
    tags: ["1440p Ultra", "16GB", "RDNA 4"],
    specs: { performanceTier: "flagship", vramGb: 16, powerDraw: 300 },
    offers: [
      {
        id: "gpu-9070xt-xfx-aliexpress",
        market: "aliexpress",
        title: "platform snapshot",
        price: 689.99,
        currency: "USD",
        note: "AliExpress snapshot",
        url: "https://www.aliexpress.com/wholesale?SearchText=XFX+RX+9070+XT+MERC",
      },
    ],
  },
  {
    id: "gpu-5070-zotac",
    category: "gpu",
    name: "GeForce RTX 5070 Twin Edge OC",
    brand: "ZOTAC",
    summary: "Compact NVIDIA card for stronger ray tracing and cleaner small-case compatibility.",
    tags: ["1440p", "12GB", "Compact"],
    specs: { performanceTier: "high", vramGb: 12, powerDraw: 250 },
    offers: [
      {
        id: "gpu-5070-zotac-bestbuy",
        market: "bestbuy",
        title: "current listing",
        price: 649.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/searchpage.jsp?st=RTX+5070+Twin+Edge+OC",
      },
    ],
  },
  {
    id: "gpu-5060ti-pny",
    category: "gpu",
    name: "GeForce RTX 5060 Ti VERTO Dual",
    brand: "PNY",
    summary: "Mid-range NVIDIA option for esports and 1440p high settings on a tighter budget.",
    tags: ["1080p+", "16GB", "Dual Fan"],
    specs: { performanceTier: "mid", vramGb: 16, powerDraw: 180 },
    offers: [
      {
        id: "gpu-5060ti-pny-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 449.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=PNY+RTX+5060+Ti+VERTO+Dual",
      },
    ],
  },
  {
    id: "ram-tforce-delta",
    category: "ram",
    name: "T-Force Delta RGB DDR5 32GB 6000",
    brand: "TeamGroup",
    summary: "Popular RGB DDR5 kit for gaming builds that want speed and stronger visual flair.",
    tags: ["32GB", "DDR5-6000", "RGB"],
    specs: { capacityGb: 32, speed: 6000, memoryType: "DDR5" },
    offers: [
      {
        id: "ram-tforce-delta-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 109.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=T-Force+Delta+RGB+DDR5+32GB+6000",
      },
    ],
  },
  {
    id: "ram-xpg-lancer",
    category: "ram",
    name: "XPG Lancer Blade DDR5 32GB 6000",
    brand: "ADATA",
    summary: "Low-profile DDR5 kit that fits easier under larger air coolers and compact layouts.",
    tags: ["32GB", "DDR5-6000", "Low Profile"],
    specs: { capacityGb: 32, speed: 6000, memoryType: "DDR5" },
    offers: [
      {
        id: "ram-xpg-lancer-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 99.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=XPG+Lancer+Blade+DDR5+32GB+6000",
      },
    ],
  },
  {
    id: "ram-viper-venom",
    category: "ram",
    name: "Viper Venom DDR5 32GB 6400",
    brand: "Patriot",
    summary: "Higher-clocked DDR5 option for users who want extra headroom on capable platforms.",
    tags: ["32GB", "DDR5-6400", "Performance"],
    specs: { capacityGb: 32, speed: 6400, memoryType: "DDR5" },
    offers: [
      {
        id: "ram-viper-venom-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 114.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Patriot+Viper+Venom+DDR5+32GB+6400",
      },
    ],
  },
  {
    id: "ssd-mp44",
    category: "ssd",
    name: "MP44 2TB",
    brand: "TeamGroup",
    summary: "Great-value PCIe 4.0 SSD for game libraries and fast everyday workstation use.",
    tags: ["2TB", "PCIe 4.0", "Value"],
    specs: { capacityTb: 2, interface: "PCIe 4.0" },
    offers: [
      {
        id: "ssd-mp44-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 129.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=TeamGroup+MP44+2TB",
      },
    ],
  },
  {
    id: "ssd-s70-blade",
    category: "ssd",
    name: "XPG Gammix S70 Blade 2TB",
    brand: "ADATA",
    summary: "Fast PCIe 4.0 SSD with a thin heatsink, useful for desktops and shared console use.",
    tags: ["2TB", "PCIe 4.0", "Thin Heatsink"],
    specs: { capacityTb: 2, interface: "PCIe 4.0" },
    offers: [
      {
        id: "ssd-s70-blade-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 139.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=XPG+Gammix+S70+Blade+2TB",
      },
    ],
  },
  {
    id: "ssd-p41",
    category: "ssd",
    name: "Platinum P41 2TB",
    brand: "SK hynix",
    summary: "Premium PCIe 4.0 SSD known for high sustained performance and strong efficiency.",
    tags: ["2TB", "PCIe 4.0", "Premium"],
    specs: { capacityTb: 2, interface: "PCIe 4.0" },
    offers: [
      {
        id: "ssd-p41-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 154.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=SK+hynix+Platinum+P41+2TB",
      },
    ],
  },
  {
    id: "cooler-ak620",
    category: "cooler",
    name: "AK620 Digital",
    brand: "DeepCool",
    summary: "Dual-tower air cooler for mainstream gaming CPUs that prefer clean acoustics over AIOs.",
    tags: ["Air", "Dual Tower", "AM5"],
    specs: { coolerType: "air", maxRadiatorMm: 0 },
    offers: [
      {
        id: "cooler-ak620-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 79.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=DeepCool+AK620+Digital",
      },
    ],
  },
  {
    id: "cooler-pureloop",
    category: "cooler",
    name: "Pure Loop 2 FX 360",
    brand: "be quiet!",
    summary: "Quiet 360mm AIO for high-core CPUs and users who want lower noise under load.",
    tags: ["360mm", "AIO", "Quiet"],
    specs: { coolerType: "liquid", maxRadiatorMm: 360 },
    offers: [
      {
        id: "cooler-pureloop-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 149.9,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Pure+Loop+2+FX+360",
      },
    ],
  },
  {
    id: "cooler-hyper622",
    category: "cooler",
    name: "Hyper 622 Halo",
    brand: "Cooler Master",
    summary: "RGB twin-tower cooler that works well for balanced gaming builds and glass-panel cases.",
    tags: ["Air", "ARGB", "Dual Tower"],
    specs: { coolerType: "air", maxRadiatorMm: 0 },
    offers: [
      {
        id: "cooler-hyper622-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 59.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Hyper+622+Halo",
      },
    ],
  },
  {
    id: "psu-focus-gx850",
    category: "psu",
    name: "FOCUS GX-850",
    brand: "Seasonic",
    summary: "Reliable 850W gold PSU with enough headroom for high-end GPUs and future upgrades.",
    tags: ["850W", "ATX 3.0", "Gold"],
    specs: { wattage: 850 },
    offers: [
      {
        id: "psu-focus-gx850-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 149.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Seasonic+FOCUS+GX-850",
      },
    ],
  },
  {
    id: "psu-purepower12m",
    category: "psu",
    name: "Pure Power 12 M 750W",
    brand: "be quiet!",
    summary: "ATX 3.x-ready PSU for quieter mid-to-high-end builds with modern GPU connectors.",
    tags: ["750W", "ATX 3.x", "Quiet"],
    specs: { wattage: 750 },
    offers: [
      {
        id: "psu-purepower12m-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 119.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Pure+Power+12+M+750W",
      },
    ],
  },
  {
    id: "psu-mwe850v3",
    category: "psu",
    name: "MWE Gold 850 V3",
    brand: "Cooler Master",
    summary: "Simple high-value 850W option for stronger GPU upgrades without overspending.",
    tags: ["850W", "Gold", "Value"],
    specs: { wattage: 850 },
    offers: [
      {
        id: "psu-mwe850v3-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 109.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=MWE+Gold+850+V3",
      },
    ],
  },
  {
    id: "case-fractal-north",
    category: "case",
    name: "North",
    brand: "Fractal Design",
    summary: "Highly popular airflow case with a warmer furniture-inspired front-panel look.",
    tags: ["ATX", "Airflow", "Wood Front"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 355, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-fractal-north-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 139.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Fractal+North",
      },
    ],
  },
  {
    id: "case-air903",
    category: "case",
    name: "AIR 903 MAX",
    brand: "Montech",
    summary: "Roomy airflow mid-tower with strong fan value for practical gaming-first builds.",
    tags: ["ATX", "Airflow", "Value"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 400, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-air903-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 74.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Montech+AIR+903+MAX",
      },
    ],
  },
  {
    id: "case-y40",
    category: "case",
    name: "Y40",
    brand: "HYTE",
    summary: "Showcase case built for panoramic side views and stronger visual presentation.",
    tags: ["ATX", "Showcase", "Panoramic"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 422, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-y40-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 129.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=HYTE+Y40",
      },
    ],
  },
  {
    id: "case-xtpro",
    category: "case",
    name: "XT Pro Ultra",
    brand: "Phanteks",
    summary: "Clean high-airflow chassis with flexible radiator support and easier cable room.",
    tags: ["ATX", "Airflow", "Builder Friendly"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 415, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-xtpro-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 89.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Phanteks+XT+Pro+Ultra",
      },
    ],
  },
  {
    id: "cpu-285k",
    category: "cpu",
    name: "Core Ultra 9 285K",
    brand: "Intel",
    summary: "Top-end Core Ultra desktop CPU for heavy creation, streaming, and flagship hybrid builds.",
    tags: ["LGA1851", "24 Cores", "125W"],
    specs: { socket: "LGA1851", tdp: 125 },
    offers: [
      {
        id: "cpu-285k-bestbuy",
        market: "bestbuy",
        title: "current listing",
        price: 589.99,
        currency: "USD",
        note: "Best Buy",
        url: "https://www.bestbuy.com/site/searchpage.jsp?st=Core+Ultra+9+285K",
      },
    ],
  },
  {
    id: "mobo-n7-b650e",
    category: "motherboard",
    name: "N7 B650E",
    brand: "NZXT",
    summary: "Clean-cover AM5 motherboard for white or minimal builds that care about visual consistency.",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-n7-b650e-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 269.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=NZXT+N7+B650E",
      },
    ],
  },
  {
    id: "mobo-b860-strix",
    category: "motherboard",
    name: "ROG Strix B860-F Gaming WiFi",
    brand: "ASUS",
    summary: "Upper-mid Intel board for newer Core Ultra builds with a stronger feature set and styling.",
    tags: ["LGA1851", "ATX", "DDR5"],
    specs: { socket: "LGA1851", formFactor: "ATX", memoryType: "DDR5" },
    offers: [
      {
        id: "mobo-b860-strix-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 259.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=ROG+Strix+B860-F+Gaming+WiFi",
      },
    ],
  },
  {
    id: "gpu-9070xt-powercolor",
    category: "gpu",
    name: "Radeon RX 9070 XT Hellhound",
    brand: "PowerColor",
    summary: "Well-known Radeon partner card aimed at high-refresh 1440p and entry 4K play.",
    tags: ["1440p Ultra", "16GB", "AMD"],
    specs: { performanceTier: "flagship", vramGb: 16, powerDraw: 304 },
    offers: [
      {
        id: "gpu-9070xt-powercolor-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 699.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=PowerColor+RX+9070+XT+Hellhound",
      },
    ],
  },
  {
    id: "ram-dominator-titanium",
    category: "ram",
    name: "Dominator Titanium RGB DDR5 32GB 6400",
    brand: "Corsair",
    summary: "Premium RGB DDR5 kit for showcase builds and higher-clocked gaming setups.",
    tags: ["32GB", "DDR5-6400", "Premium RGB"],
    specs: { capacityGb: 32, speed: 6400, memoryType: "DDR5" },
    offers: [
      {
        id: "ram-dominator-titanium-official",
        market: "official",
        title: "brand store",
        price: 174.99,
        currency: "USD",
        note: "Corsair official",
        url: "https://www.corsair.com/us/en/s/dominator-titanium-ddr5-memory",
      },
    ],
  },
  {
    id: "ram-ares-rgb",
    category: "ram",
    name: "ARES RGB DDR5 32GB 6400",
    brand: "Lexar",
    summary: "Fast RGB DDR5 kit suited to users who want higher clocks and a slimmer module profile.",
    tags: ["32GB", "DDR5-6400", "RGB"],
    specs: { capacityGb: 32, speed: 6400, memoryType: "DDR5" },
    offers: [
      {
        id: "ram-ares-rgb-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 119.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Lexar+ARES+RGB+DDR5+32GB+6400",
      },
    ],
  },
  {
    id: "ssd-firecuda530r",
    category: "ssd",
    name: "FireCuda 530R 2TB",
    brand: "Seagate",
    summary: "High-end PCIe 4.0 SSD tuned for heavier game libraries and sustained transfer work.",
    tags: ["2TB", "PCIe 4.0", "High End"],
    specs: { capacityTb: 2, interface: "PCIe 4.0" },
    offers: [
      {
        id: "ssd-firecuda530r-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 169.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=FireCuda+530R+2TB",
      },
    ],
  },
  {
    id: "ssd-p44pro",
    category: "ssd",
    name: "P44 Pro 2TB",
    brand: "Solidigm",
    summary: "Fast premium SSD with strong random performance for game-heavy and workstation use.",
    tags: ["2TB", "PCIe 4.0", "Premium"],
    specs: { capacityTb: 2, interface: "PCIe 4.0" },
    offers: [
      {
        id: "ssd-p44pro-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 159.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Solidigm+P44+Pro+2TB",
      },
    ],
  },
  {
    id: "cooler-liquid-freezer-iii",
    category: "cooler",
    name: "Liquid Freezer III 360",
    brand: "Arctic",
    summary: "AIO favorite for excellent thermal performance and good value on higher-power CPUs.",
    tags: ["360mm", "AIO", "High Performance"],
    specs: { coolerType: "liquid", maxRadiatorMm: 360 },
    offers: [
      {
        id: "cooler-liquid-freezer-iii-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 139.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Arctic+Liquid+Freezer+III+360",
      },
    ],
  },
  {
    id: "cooler-phantom-spirit",
    category: "cooler",
    name: "Phantom Spirit 120 SE",
    brand: "Thermalright",
    summary: "Excellent-value dual-tower air cooler that is still widely recommended for gaming CPUs.",
    tags: ["Air", "Dual Tower", "Value"],
    specs: { coolerType: "air", maxRadiatorMm: 0 },
    offers: [
      {
        id: "cooler-phantom-spirit-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 37.9,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Thermalright+Phantom+Spirit+120+SE",
      },
    ],
  },
  {
    id: "psu-leadex-vii",
    category: "psu",
    name: "Leadex VII XG 1000W",
    brand: "Super Flower",
    summary: "High-capacity gold PSU with strong reputation for flagship GPU and future-proof upgrades.",
    tags: ["1000W", "ATX 3.1", "Gold"],
    specs: { wattage: 1000 },
    offers: [
      {
        id: "psu-leadex-vii-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 189.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Super+Flower+Leadex+VII+XG+1000W",
      },
    ],
  },
  {
    id: "psu-toughpower-gfa3",
    category: "psu",
    name: "Toughpower GF A3 850W",
    brand: "Thermaltake",
    summary: "Modern ATX 3-ready PSU for high-end gaming builds that still want sensible pricing.",
    tags: ["850W", "ATX 3.0", "Gold"],
    specs: { wattage: 850 },
    offers: [
      {
        id: "psu-toughpower-gfa3-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 124.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Toughpower+GF+A3+850W",
      },
    ],
  },
  {
    id: "case-c8",
    category: "case",
    name: "C8",
    brand: "Antec",
    summary: "Dual-chamber panoramic case for showcase builds with long GPUs and multiple radiators.",
    tags: ["ATX", "Panoramic", "Dual Chamber"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 440, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-c8-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 109.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=Antec+C8",
      },
    ],
  },
  {
    id: "case-lightbase-600",
    category: "case",
    name: "Light Base 600 LX",
    brand: "be quiet!",
    summary: "Premium showcase chassis for quieter high-end systems with lots of cooling flexibility.",
    tags: ["ATX", "Showcase", "Premium"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 400, maxRadiatorMm: 360 },
    offers: [
      {
        id: "case-lightbase-600-amazon",
        market: "amazon",
        title: "price snapshot",
        price: 169.99,
        currency: "USD",
        note: "Amazon snapshot",
        url: "https://www.amazon.com/s?k=be+quiet+Light+Base+600+LX",
      },
    ],
  }
];

const parts: Part[] = [...catalogParts, ...extraParts].map((part) => ({
  ...part,
  offers: part.offers.map((offer) => {
    const liveEntry = livePriceFeed.offers[offer.id];
    if (!liveEntry) {
      return offer;
    }

    return {
      ...offer,
      price: liveEntry.price ?? offer.price,
      currency: liveEntry.currency ?? offer.currency,
      note: liveEntry.note ?? offer.note,
      url: liveEntry.url ?? offer.url,
    };
  }),
}));

const presets: Preset[] = [
  {
    id: "balanced",
    name: "主流均衡型",
    parts: {
      cpu: "cpu-9600",
      motherboard: "mobo-colorful-b650me",
      gpu: "gpu-5060-msi",
      ram: "ram-crucial",
      ssd: "ssd-990pro",
      cooler: "cooler-msi",
      psu: "psu-650",
      case: "case-forge",
    },
  },
  {
    id: "amd-premium",
    name: "AMD 高配型",
    parts: {
      cpu: "cpu-9800x3d",
      motherboard: "mobo-b850",
      gpu: "gpu-5070-gigabyte",
      ram: "ram-gskill",
      ssd: "ssd-arespro",
      cooler: "cooler-nzxt",
      psu: "psu-850-white",
      case: "case-h7",
    },
  },
  {
    id: "intel-builder",
    name: "Intel 创作型",
    parts: {
      cpu: "cpu-14600k",
      motherboard: "mobo-z790",
      gpu: "gpu-5070-msi",
      ram: "ram-kingston",
      ssd: "ssd-t500",
      cooler: "cooler-corsair",
      psu: "psu-rm850e",
      case: "case-lancool216",
    },
  },
];

const partsById = new Map(parts.map((part) => [part.id, part]));
const brandCount = new Set(parts.map((part) => part.brand)).size;
const totalOffers = parts.reduce((sum, part) => sum + part.offers.length, 0);

const toGbp = (price: number, currency: Offer["currency"]) => {
  if (currency === "USD") return price * usdToGbp;
  if (currency === "EUR") return price * eurToGbp;
  return price;
};

const fmt = (price: number, currency: Offer["currency"]) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(price);

const gbp = (price: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(price);

const byCategory = (categoryId: CategoryId) => parts.filter((part) => part.category === categoryId);
const brandsForCategory = (categoryId: CategoryId) =>
  [...new Set(byCategory(categoryId).map((part) => part.brand))].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

const cheapest = (part: Part) =>
  [...part.offers].sort((a, b) => toGbp(a.price, a.currency) - toGbp(b.price, b.currency))[0];

const chosenOffer = (part: Part, offerId?: string) =>
  part.offers.find((offer) => offer.id === offerId) ?? cheapest(part);

const offerMapFrom = (selected: Record<CategoryId, string>) =>
  Object.fromEntries(
    Object.entries(selected).map(([categoryId, partId]) => [categoryId, cheapest(partsById.get(partId)!).id])
  ) as Record<CategoryId, string>;

const brandMapFrom = (selected: Record<CategoryId, string>) =>
  Object.fromEntries(
    categories.map((category) => [
      category.id,
      partsById.get(selected[category.id])?.brand ?? brandsForCategory(category.id)[0] ?? "",
    ])
  ) as Record<CategoryId, string>;

const cpuTierMap: Record<string, number> = {
  "cpu-9600": 66,
  "cpu-7600x": 70,
  "cpu-7800x3d": 88,
  "cpu-9700x": 82,
  "cpu-9800x3d": 96,
  "cpu-14600k": 78,
  "cpu-14700k": 88,
  "cpu-265k": 90,
  "cpu-285k": 96,
  "cpu-9900x": 92,
};

const gpuTierMap: Record<string, number> = {
  "gpu-5060-msi": 62,
  "gpu-5060ti-galax": 68,
  "gpu-5060ti-pny": 69,
  "gpu-5060-palit": 63,
  "gpu-rx9060xt": 76,
  "gpu-7800xt-sapphire": 82,
  "gpu-5070-gigabyte": 84,
  "gpu-5070-msi": 86,
  "gpu-5070-zotac": 85,
  "gpu-5070ti-asus": 93,
  "gpu-9070xt-xfx": 95,
  "gpu-9070xt-powercolor": 95,
  "gpu-5080-msi": 98,
  "gpu-5080-asus": 99,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const ramCapacityFrom = (part: Part) => Number(part.name.match(/(\d+)\s*GB/i)?.[1] ?? 32);
const fpsRange = (center: number, spread: number) => `${Math.round(clamp(center - spread, 28, 420))}-${Math.round(clamp(center + spread, 32, 460))} FPS`;
const qualityLabel = (value: number) => {
  if (value >= 92) return "极高 / 最高";
  if (value >= 78) return "高";
  if (value >= 64) return "中高";
  return "中";
};

const performanceTier = (value: number) => {
  if (value >= 92) return "非常流畅";
  if (value >= 78) return "流畅";
  if (value >= 64) return "可流畅游玩";
  return "建议适当降画质";
};

export default function Home() {
  const [presetId, setPresetId] = useState<string>(presets[0].id);
  const [selectedParts, setSelectedParts] = useState<Record<CategoryId, string>>(presets[0].parts);
  const [selectedOffers, setSelectedOffers] = useState<Record<CategoryId, string>>(offerMapFrom(presets[0].parts));
  const [activeBrands, setActiveBrands] = useState<Record<CategoryId, string>>(brandMapFrom(presets[0].parts));
  const activePreset = presets.find((preset) => preset.id === presetId) ?? presets[0];
  const isCustomBuild = JSON.stringify(selectedParts) !== JSON.stringify(activePreset.parts);

  const selectedPartRecord = Object.fromEntries(
    categories.map((category) => [category.id, partsById.get(selectedParts[category.id])!])
  ) as Record<CategoryId, Part>;

  const selectedOfferRecord = Object.fromEntries(
    categories.map((category) => [category.id, chosenOffer(selectedPartRecord[category.id], selectedOffers[category.id])])
  ) as Record<CategoryId, Offer>;

  const selectedLinkGroups = categories.map((category) => ({
    category,
    part: selectedPartRecord[category.id],
    offer: selectedOfferRecord[category.id],
  }));

  const cpuTier = cpuTierMap[selectedPartRecord.cpu.id] ?? 72;
  const gpuTier = gpuTierMap[selectedPartRecord.gpu.id] ?? 70;
  const ramGb = ramCapacityFrom(selectedPartRecord.ram);
  const storageTb = Number(selectedPartRecord.ssd.specs.capacityTb ?? 1);
  const ramBonus = ramGb >= 64 ? 10 : ramGb >= 32 ? 5 : 0;

  const esportsScore = clamp(cpuTier * 1.28 + gpuTier * 0.92 + ramBonus, 45, 100);
  const aaaScore = clamp(cpuTier * 0.62 + gpuTier * 1.12 + ramBonus, 40, 100);
  const heavyAaaScore = clamp(cpuTier * 0.48 + gpuTier * 1.06 + ramBonus - 4, 35, 100);

  const gameEstimates = [
    {
      title: "主流竞技网游",
      summary: "CS2 / Valorant / Apex / LoL",
      fps: fpsRange(esportsScore * 2.35, 24),
      quality: qualityLabel(esportsScore),
      resolution: esportsScore >= 82 ? "1080p 高到极高，1440p 也较稳" : "1080p 中高到高",
      smoothness: performanceTier(esportsScore),
    },
    {
      title: "常见 3A 游戏",
      summary: "黑神话 / 赛博朋克 / 地平线 / 荒野大镖客 2",
      fps: fpsRange(aaaScore * 1.18, 12),
      quality: qualityLabel(aaaScore),
      resolution: aaaScore >= 86 ? "1440p 高画质" : aaaScore >= 72 ? "1080p 极高或 1440p 中高" : "1080p 中高",
      smoothness: performanceTier(aaaScore),
    },
    {
      title: "Steam 重度 3A",
      summary: "星空 / Alan Wake 2 / 龙之信条 2 / 城市天际线 2",
      fps: fpsRange(heavyAaaScore * 0.92, 10),
      quality: qualityLabel(heavyAaaScore),
      resolution: heavyAaaScore >= 88 ? "1440p 高画质，必要时开 DLSS/FSR" : "1080p 高或 1440p 中",
      smoothness: performanceTier(heavyAaaScore),
    },
  ];

  const buildHighlights = [
    `CPU / GPU 组合强度：${performanceTier(clamp((cpuTier + gpuTier) / 2, 40, 100))}`,
    `${ramGb}GB DDR5 内存适合当前主流游戏与多任务`,
    `${storageTb}TB SSD 适合系统盘 + 常玩游戏库`,
  ];

  const defaultParts = presets[0].parts;
  const defaultOfferMap = offerMapFrom(defaultParts);
  const cheapestOfferMap = Object.fromEntries(
    categories.map((category) => [category.id, cheapest(selectedPartRecord[category.id]).id])
  ) as Record<CategoryId, string>;

  const canResetToDefault =
    JSON.stringify(selectedParts) !== JSON.stringify(defaultParts) ||
    JSON.stringify(selectedOffers) !== JSON.stringify(defaultOfferMap) ||
    presetId !== presets[0].id;

  const canSwitchToCheapest = JSON.stringify(selectedOffers) !== JSON.stringify(cheapestOfferMap);

  const total = Object.values(selectedOfferRecord).reduce((sum, offer) => sum + toGbp(offer.price, offer.currency), 0);

  const marketSpend = Object.values(selectedOfferRecord).reduce<Record<string, number>>((acc, offer) => {
    acc[offer.market] = (acc[offer.market] ?? 0) + toGbp(offer.price, offer.currency);
    return acc;
  }, {});

  const compatibility = [
    {
      status: String(selectedPartRecord.cpu.specs.socket) === String(selectedPartRecord.motherboard.specs.socket) ? "pass" : "fail",
      text:
        String(selectedPartRecord.cpu.specs.socket) === String(selectedPartRecord.motherboard.specs.socket)
          ? `CPU 与主板插槽匹配：${String(selectedPartRecord.cpu.specs.socket)}`
          : `CPU ${String(selectedPartRecord.cpu.specs.socket)} 与主板 ${String(selectedPartRecord.motherboard.specs.socket)} 不匹配`,
    },
    {
      status:
        String(selectedPartRecord.ram.specs.memoryType) === String(selectedPartRecord.motherboard.specs.memoryType)
          ? "pass"
          : "fail",
      text:
        String(selectedPartRecord.ram.specs.memoryType) === String(selectedPartRecord.motherboard.specs.memoryType)
          ? `内存代际匹配：${String(selectedPartRecord.ram.specs.memoryType)}`
          : `主板要求 ${String(selectedPartRecord.motherboard.specs.memoryType)}，当前内存为 ${String(selectedPartRecord.ram.specs.memoryType)}`,
    },
    {
      status:
        (selectedPartRecord.cooler.specs.supportedSockets as string[]).includes(String(selectedPartRecord.cpu.specs.socket))
          ? "pass"
          : "fail",
      text:
        (selectedPartRecord.cooler.specs.supportedSockets as string[]).includes(String(selectedPartRecord.cpu.specs.socket))
          ? `散热器支持 ${String(selectedPartRecord.cpu.specs.socket)}`
          : `散热器未声明支持 ${String(selectedPartRecord.cpu.specs.socket)}`,
    },
    {
      status:
        (selectedPartRecord.case.specs.supportedFormFactors as string[]).includes(
          String(selectedPartRecord.motherboard.specs.formFactor)
        )
          ? "pass"
          : "fail",
      text:
        (selectedPartRecord.case.specs.supportedFormFactors as string[]).includes(
          String(selectedPartRecord.motherboard.specs.formFactor)
        )
          ? `机箱支持 ${String(selectedPartRecord.motherboard.specs.formFactor)} 主板`
          : `机箱不支持 ${String(selectedPartRecord.motherboard.specs.formFactor)} 主板`,
    },
    {
      status: Number(selectedPartRecord.case.specs.maxGpuLengthMm) >= Number(selectedPartRecord.gpu.specs.lengthMm) ? "pass" : "warn",
      text:
        Number(selectedPartRecord.case.specs.maxGpuLengthMm) >= Number(selectedPartRecord.gpu.specs.lengthMm)
          ? `显卡长度 ${Number(selectedPartRecord.gpu.specs.lengthMm)}mm 在机箱范围内`
          : "显卡长度接近机箱上限，建议再核对具体安装空间",
    },
    {
      status:
        Number(selectedPartRecord.case.specs.maxRadiatorMm) >= Number(selectedPartRecord.cooler.specs.radiatorMm)
          ? "pass"
          : "warn",
      text:
        Number(selectedPartRecord.case.specs.maxRadiatorMm) >= Number(selectedPartRecord.cooler.specs.radiatorMm)
          ? `机箱可容纳 ${Number(selectedPartRecord.cooler.specs.radiatorMm)}mm 冷排`
          : `请再确认机箱是否支持 ${Number(selectedPartRecord.cooler.specs.radiatorMm)}mm 冷排`,
    },
    {
      status:
        Number(selectedPartRecord.psu.specs.wattage) >=
        Number(selectedPartRecord.cpu.specs.tdp) +
          Number(selectedPartRecord.gpu.specs.boardPower) +
          180
          ? "pass"
          : "warn",
      text:
        Number(selectedPartRecord.psu.specs.wattage) >=
        Number(selectedPartRecord.cpu.specs.tdp) +
          Number(selectedPartRecord.gpu.specs.boardPower) +
          180
          ? `电源 ${Number(selectedPartRecord.psu.specs.wattage)}W 留有一定余量`
          : "建议再提高电源瓦数，给显卡与瞬时峰值留更多空间",
    },
  ];

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    inLanguage: "zh-CN",
    keywords: defaultKeywords.join(", "),
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: siteUrl,
    description: siteDescription,
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.22),transparent_22rem),radial-gradient(circle_at_top_right,rgba(139,224,210,0.18),transparent_24rem),linear-gradient(180deg,#07111f_0%,#0a1728_48%,#08111d_100%)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <div className="mx-auto flex w-[min(calc(100%-20px),1400px)] flex-col gap-5 py-5 md:w-[min(calc(100%-32px),1400px)] md:py-7">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,420px)]">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-11">
            <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Rig Atlas</p>
            <h1 className="max-w-[12ch] text-5xl leading-none font-semibold tracking-[-0.04em] md:text-7xl">
              自己 DIY 选配整机，同时看跨站价格
            </h1>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-slate-300">
              面向公开访问的装机选配站点。现在已经补充了更多主流品牌与常用型号，用户可以自己逐项选择 CPU、主板、显卡、内存、
              SSD、散热器、电源和机箱，并同步看到不同渠道的价格快照。
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#builder"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-br from-[#ff6b35] to-[#ff8f5e] px-5 text-sm font-bold text-[#09111d]"
              >
                开始选配
              </a>
              <a
                href="#sources"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm"
              >
                查看价格来源
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,107,53,0.16),transparent_36%),linear-gradient(200deg,rgba(139,224,210,0.13),transparent_45%),rgba(14,28,48,0.94)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
            {[
              ["快照日期", snapshotDate],
              ["已接入市场", "Amazon / Joybuy / AliExpress / Best Buy / 品牌商城"],
              ["部署方式", "GitHub Pages"],
              ["当前模式", "公开浏览 + 更多品牌 + 官方价每日检查"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-none last:pb-0">
                <span className="text-slate-300">{label}</span>
                <strong className="text-right">{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [String(categories.length), "核心分类"],
            [String(parts.length), "可选配件"],
            [String(brandCount), "覆盖品牌"],
            [String(totalOffers), "价格快照条目"],
          ].map(([value, label]) => (
            <article key={label} className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5">
              <span className="block text-3xl font-extrabold tracking-[-0.04em]">{value}</span>
              <span className="text-slate-300">{label}</span>
            </article>
          ))}
        </section>

        <section className="grid gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(90deg,rgba(255,107,53,0.12),transparent_22%),rgba(255,255,255,0.03)] px-8 py-7 md:grid-cols-2">
          <div>
            <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Market Coverage</p>
            <h2 className="text-3xl leading-tight font-semibold tracking-[-0.04em]">
              先把装机选择做丰富，再逐步接入更多市场价格
            </h2>
          </div>
          <p className="text-base leading-7 text-slate-300">
            现在这个版本不只是配件更丰富，还增加了每日价格检查的数据层。官方商城来源会每天自动检查价格，Amazon、Joybuy、AliExpress 这类受限制来源则继续保留最近可核对的快照。
          </p>
        </section>

        <section id="builder" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.72fr)]">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-7">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Builder</p>
                <h2 className="text-4xl font-semibold tracking-[-0.04em]">多品牌 DIY 选配目录</h2>
              </div>
              <p className="max-w-[48ch] text-sm leading-7 text-slate-300">
                现在每个分类都会先按品牌归类，再展开品牌下的具体型号。先选品牌，再选配件，浏览和比较会更清楚。
              </p>
            </div>

            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setPresetId(preset.id);
                      setSelectedParts(preset.parts);
                      setSelectedOffers(offerMapFrom(preset.parts));
                      setActiveBrands(brandMapFrom(preset.parts));
                    }}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      presetId === preset.id
                        ? "border-[#ff6b35]/70 bg-[#ff6b35]/15"
                        : "border-white/10 bg-white/5 hover:border-[#ff6b35]/60 hover:bg-[#ff6b35]/10"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={!canSwitchToCheapest}
                  onClick={() => {
                    setSelectedOffers(cheapestOfferMap);
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    canSwitchToCheapest
                      ? "border-white/10 bg-white/6 hover:border-[#8be0d2]/40"
                      : "cursor-not-allowed border-white/8 bg-white/4 text-slate-500"
                  }`}
                >
                  {canSwitchToCheapest ? "全部切到最低价" : "当前已是最低价"}
                </button>
                <button
                  type="button"
                  disabled={!canResetToDefault}
                  onClick={() => {
                    setPresetId(presets[0].id);
                    setSelectedParts(defaultParts);
                    setSelectedOffers(defaultOfferMap);
                    setActiveBrands(brandMapFrom(defaultParts));
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    canResetToDefault
                      ? "border-white/10 bg-white/6 hover:border-[#ff6b35]/50"
                      : "cursor-not-allowed border-white/8 bg-white/4 text-slate-500"
                  }`}
                >
                  {canResetToDefault ? "恢复默认方案" : "当前已是默认方案"}
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {categories.map((category) => {
                const categoryParts = byCategory(category.id);
                const categoryBrands = brandsForCategory(category.id);
                const activeBrand = categoryBrands.includes(activeBrands[category.id]) ? activeBrands[category.id] : categoryBrands[0];
                const visibleParts = categoryParts.filter((part) => part.brand === activeBrand);
                const selectedBrand = selectedPartRecord[category.id].brand;

                return (
                <section key={category.id} className="rounded-[20px] border border-white/10 bg-white/4 p-4">
                  <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                      <p className="mt-1 max-w-[58ch] text-sm leading-6 text-slate-300">{category.description}</p>
                    </div>
                    <span className="w-fit rounded-full border border-[#8be0d2]/30 px-3 py-1.5 text-xs text-[#8be0d2]">
                      {categoryBrands.length} brands / {categoryParts.length} parts
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8be0d2]">Select Brand First</p>
                      <p className="text-xs text-slate-400">Current brand: {selectedBrand}</p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {categoryBrands.map((brand) => {
                        const brandParts = categoryParts.filter((part) => part.brand === brand);
                        const isActive = activeBrand === brand;
                        const isSelected = selectedBrand === brand;

                        return (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => setActiveBrands((prev) => ({ ...prev, [category.id]: brand }))}
                            className={`rounded-[16px] border px-4 py-3 text-left transition ${
                              isActive
                                ? "border-[#8be0d2]/55 bg-[#8be0d2]/10"
                                : "border-white/10 bg-[#0a1728]/70 hover:border-[#8be0d2]/35"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <strong className="block truncate text-sm">{brand}</strong>
                                <span className="mt-1 block text-xs text-slate-400">
                                  {brandParts.length} models{isSelected ? " · selected" : ""}
                                </span>
                              </div>
                              <span
                                className={`rounded-full px-2.5 py-1 text-[11px] ${
                                  isActive ? "bg-[#8be0d2]/14 text-[#b8fff4]" : "bg-white/6 text-slate-300"
                                }`}
                              >
                                {brandParts.length}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#8be0d2]">{activeBrand} models</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {visibleParts.length} shown
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {visibleParts.map((part) => {
                      const currentOffer = chosenOffer(part, selectedOffers[category.id]);

                      return (
                        <article
                          key={part.id}
                          className={`rounded-[16px] border bg-[#0a1728]/90 p-3 transition ${
                            selectedParts[category.id] === part.id
                              ? "border-[#ff6b35]/60"
                              : "border-white/10 hover:border-[#ff6b35]/45"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedParts((prev) => ({ ...prev, [category.id]: part.id }));
                              setSelectedOffers((prev) => ({ ...prev, [category.id]: cheapest(part).id }));
                              setActiveBrands((prev) => ({ ...prev, [category.id]: part.brand }));
                            }}
                            className="block w-full text-left"
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="min-w-0">
                                <h4 className="line-clamp-2 text-[1.05rem] leading-5 font-medium">{part.name}</h4>
                                <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-slate-400">{part.brand}</p>
                              </div>
                              <span className="shrink-0 rounded-xl bg-[#8be0d2]/10 px-2.5 py-1.5 text-sm font-bold text-[#8be0d2]">
                                {gbp(toGbp(cheapest(part).price, cheapest(part).currency))}
                              </span>
                            </div>
                            <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-slate-300">{part.summary}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {part.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-white/6 px-2 py-1 text-[11px] text-slate-200">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </button>

                          <div className="mt-3 grid gap-1.5">
                            {part.offers.map((offer) => (
                              <button
                                key={offer.id}
                                type="button"
                                onClick={() => setSelectedOffers((prev) => ({ ...prev, [category.id]: offer.id }))}
                                className={`flex w-full items-start justify-between gap-2 rounded-[12px] border px-2.5 py-2 text-left transition ${
                                  currentOffer.id === offer.id
                                    ? "border-[#8be0d2]/45 bg-[#8be0d2]/8"
                                    : "border-white/10 bg-white/4 hover:border-[#8be0d2]/35"
                                }`}
                              >
                                <span className="grid min-w-0 gap-0.5">
                                  <strong className="line-clamp-1 text-xs">
                                    {marketMeta[offer.market].label} · {offer.title}
                                  </strong>
                                  <small className="line-clamp-1 text-[11px] text-slate-400">{offer.note}</small>
                                </span>
                                <span className="shrink-0 text-right text-xs text-slate-200">
                                  {fmt(offer.price, offer.currency)}
                                  <small className="block text-[11px] text-slate-400">
                                    ≈ {gbp(toGbp(offer.price, offer.currency))}
                                  </small>
                                </span>
                              </button>
                            ))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
                );
              })}
            </div>
          </div>
          <aside className="pc-scrollbar grid gap-4 xl:sticky xl:top-5 xl:self-start xl:h-[calc(100vh-2.5rem)] xl:overflow-y-scroll xl:overscroll-contain xl:pr-2 xl:pb-4">
            <section className="flex min-h-0 flex-col rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
              <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Current Build</p>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs ${isCustomBuild ? "bg-[#8be0d2]/12 text-[#8be0d2]" : "bg-[#ff6b35]/12 text-[#ffb89d]"}`}>
                  {isCustomBuild ? "DIY 自定义中" : `当前基于 ${activePreset.name}`}
                </span>
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">
                {selectedPartRecord.cpu.name} + {selectedPartRecord.gpu.name}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {selectedPartRecord.motherboard.name} / {selectedPartRecord.ram.name} / {selectedPartRecord.case.name}
              </p>
              <div className="mt-5 rounded-[20px] bg-[linear-gradient(135deg,rgba(255,107,53,0.16),rgba(255,107,53,0.04)),rgba(255,255,255,0.03)] p-5">
                <span className="block text-sm text-slate-300">预估总价</span>
                <strong className="mt-2 block text-4xl tracking-[-0.04em]">{gbp(total)}</strong>
                <small className="block text-sm text-slate-400">
                  按 1 USD = 0.7465 GBP、1 EUR = 0.8575 GBP 估算，每日检查日期 {snapshotDate}
                </small>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">已选配件</h3>
                <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
                  {categories.length} / {categories.length}
                </span>
              </div>
              <div className="grid gap-2.5">
                {categories.map((category) => (
                  <div key={category.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
                    <strong className="block text-sm">
                      {category.title} · {selectedPartRecord[category.id].name}
                    </strong>
                    <small className="text-xs leading-6 text-slate-400">
                      {marketMeta[selectedOfferRecord[category.id].market].label} ·{" "}
                      {fmt(selectedOfferRecord[category.id].price, selectedOfferRecord[category.id].currency)} · 约{" "}
                      {gbp(toGbp(selectedOfferRecord[category.id].price, selectedOfferRecord[category.id].currency))}
                    </small>
                    <a
                      href={selectedOfferRecord[category.id].url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-[#8be0d2]/40"
                    >
                      查看当前价格来源
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
              <h3 className="mb-4 text-lg font-semibold">兼容性检查</h3>
              <div className="grid gap-2.5">
                {compatibility.map((item) => (
                  <div key={item.text} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                        item.status === "pass" ? "bg-emerald-400" : item.status === "warn" ? "bg-amber-300" : "bg-rose-400"
                      }`}
                    />
                    <span className="text-sm text-slate-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
              <h3 className="mb-4 text-lg font-semibold">渠道分布</h3>
              <div className="grid gap-2.5">
                {Object.entries(marketSpend).map(([market, value]) => (
                  <div key={market} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
                    <div>
                      <strong className="block text-sm">{marketMeta[market as MarketId].label}</strong>
                      <small className="text-xs text-slate-400">{gbp(value)}</small>
                    </div>
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max((value / total) * 100, 8)}%`,
                          background: marketMeta[market as MarketId].color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-7">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Game Estimate</p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em]">当前配置游戏流畅度</h2>
            </div>
            <p className="max-w-[54ch] text-sm leading-7 text-slate-300">
              这是基于当前 CPU、显卡和内存组合做的站内估算，适合快速判断主流网游、常见 3A 和 Steam 重度 3A 的大致帧率与画质区间。
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {buildHighlights.map((item) => (
              <span key={item} className="rounded-full border border-[#8be0d2]/20 bg-[#8be0d2]/8 px-3 py-1.5 text-xs text-[#b8fff4]">
                {item}
              </span>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {gameEstimates.map((item) => (
              <article key={item.title} className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8be0d2]">{item.title}</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{item.fps}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.summary}</p>
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
                    <span className="text-slate-400">推荐画质</span>
                    <strong>{item.quality}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
                    <span className="text-slate-400">建议分辨率</span>
                    <strong className="text-right">{item.resolution}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
                    <span className="text-slate-400">流畅度判断</span>
                    <strong className="text-[#8be0d2]">{item.smoothness}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-7">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Selected Links</p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em]">当前配置购买链接</h2>
            </div>
            <p className="max-w-[50ch] text-sm leading-7 text-slate-300">
              这里集中放当前已经选中的每个配件链接，方便你在确认整机方案后直接逐项打开对应页面核对价格和下单。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {selectedLinkGroups.map(({ category, part, offer }) => (
              <article key={category.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8be0d2]">{category.title}</p>
                <h3 className="mt-2 text-lg font-semibold">{part.name}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  {marketMeta[offer.market].label} · {fmt(offer.price, offer.currency)}
                </p>
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm hover:border-[#ff6b35]/60"
                >
                  打开当前配件链接
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="sources" className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-7">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Source Snapshot</p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em]">当前价格来源说明</h2>
            </div>
            <p className="max-w-[50ch] text-sm leading-7 text-slate-300">
              官方商城链接会通过 GitHub Actions 每日自动检查价格；Amazon、Joybuy、AliExpress 等受限制来源保留最近一次成功快照。点击来源按钮即可继续核对。
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <article key={category.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4">
                <h3 className="text-base font-semibold">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{category.description}</p>
                <p className="mt-2 text-xs text-slate-400">价格快照日期：{snapshotDate}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {byCategory(category.id).flatMap((part) =>
                    part.offers.map((offer) => (
                      <a
                        key={offer.id}
                        href={offer.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-[#ff6b35]/60"
                      >
                        {marketMeta[offer.market].label} · {part.name}
                      </a>
                    ))
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
