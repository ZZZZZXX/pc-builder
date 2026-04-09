"use client";

import { useState } from "react";

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

const usdToGbp = 0.7465;
const eurToGbp = 0.8575;
const snapshotDate = "2026-04-09";

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

const parts: Part[] = [
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

const cheapest = (part: Part) =>
  [...part.offers].sort((a, b) => toGbp(a.price, a.currency) - toGbp(b.price, b.currency))[0];

const chosenOffer = (part: Part, offerId?: string) =>
  part.offers.find((offer) => offer.id === offerId) ?? cheapest(part);

const offerMapFrom = (selected: Record<CategoryId, string>) =>
  Object.fromEntries(
    Object.entries(selected).map(([categoryId, partId]) => [categoryId, cheapest(partsById.get(partId)!).id])
  ) as Record<CategoryId, string>;

export default function Home() {
  const [presetId, setPresetId] = useState<string>(presets[0].id);
  const [selectedParts, setSelectedParts] = useState<Record<CategoryId, string>>(presets[0].parts);
  const [selectedOffers, setSelectedOffers] = useState<Record<CategoryId, string>>(offerMapFrom(presets[0].parts));
  const activePreset = presets.find((preset) => preset.id === presetId) ?? presets[0];
  const isCustomBuild = JSON.stringify(selectedParts) !== JSON.stringify(activePreset.parts);

  const selectedPartRecord = Object.fromEntries(
    categories.map((category) => [category.id, partsById.get(selectedParts[category.id])!])
  ) as Record<CategoryId, Part>;

  const selectedOfferRecord = Object.fromEntries(
    categories.map((category) => [category.id, chosenOffer(selectedPartRecord[category.id], selectedOffers[category.id])])
  ) as Record<CategoryId, Offer>;

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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.22),transparent_22rem),radial-gradient(circle_at_top_right,rgba(139,224,210,0.18),transparent_24rem),linear-gradient(180deg,#07111f_0%,#0a1728_48%,#08111d_100%)] text-white">
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
              ["当前模式", "公开浏览 + DIY 自选 + 价格快照"],
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
            这个版本已经从“预设整机展示”升级成“可自由选件的 DIY 装机站”。新增了更多常见品牌和段位选择，适合先公开上线验证体验。
            后续如果你要接入更实时的抓价 API，这套数据结构也能继续往下扩展。
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
                每个分类里都加入了更多主流品牌与常用型号。点卡片切换配件，点下方市场按钮切换当前采用的价格来源。
              </p>
            </div>

            <div className="mb-5 rounded-[20px] border border-[#8be0d2]/25 bg-[#8be0d2]/8 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <strong className="block text-sm text-[#8be0d2]">DIY 自定义装机</strong>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    预设只作为快捷入口。你可以自己逐项选择 CPU、主板、显卡、内存、SSD、电源、机箱和散热器，页面会同步刷新每个配件的价格与整机总价。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOffers(
                        Object.fromEntries(
                          categories.map((category) => [category.id, cheapest(partsById.get(selectedParts[category.id])!).id])
                        ) as Record<CategoryId, string>
                      );
                    }}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm hover:border-[#8be0d2]/40"
                  >
                    全部切到最低价
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPresetId(presets[0].id);
                      setSelectedParts(presets[0].parts);
                      setSelectedOffers(offerMapFrom(presets[0].parts));
                    }}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm hover:border-[#ff6b35]/50"
                  >
                    恢复默认方案
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setPresetId(preset.id);
                    setSelectedParts(preset.parts);
                    setSelectedOffers(offerMapFrom(preset.parts));
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

            <div className="grid gap-5">
              {categories.map((category) => (
                <section key={category.id} className="rounded-[20px] border border-white/10 bg-white/4 p-5">
                  <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{category.title}</h3>
                      <p className="mt-2 max-w-[58ch] text-sm leading-7 text-slate-300">{category.description}</p>
                    </div>
                    <span className="w-fit rounded-full border border-[#8be0d2]/30 px-3 py-2 text-sm text-[#8be0d2]">
                      {byCategory(category.id).length} 个可选项
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {byCategory(category.id).map((part) => {
                      const currentOffer = chosenOffer(part, selectedOffers[category.id]);

                      return (
                        <article
                          key={part.id}
                          className={`rounded-[18px] border bg-[#0a1728]/90 p-4 transition ${
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
                            }}
                            className="block w-full text-left"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-lg leading-6 font-medium">{part.name}</h4>
                                <p className="mt-1 text-sm text-slate-400">{part.brand}</p>
                              </div>
                              <span className="rounded-xl bg-[#8be0d2]/10 px-3 py-2 text-sm font-bold text-[#8be0d2]">
                                {gbp(toGbp(cheapest(part).price, cheapest(part).currency))}
                              </span>
                            </div>
                            <p className="mt-4 min-h-14 text-sm leading-6 text-slate-300">{part.summary}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {part.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-white/6 px-2.5 py-1.5 text-xs text-slate-200">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </button>

                          <div className="mt-4 grid gap-2">
                            {part.offers.map((offer) => (
                              <button
                                key={offer.id}
                                type="button"
                                onClick={() => setSelectedOffers((prev) => ({ ...prev, [category.id]: offer.id }))}
                                className={`flex w-full items-start justify-between gap-3 rounded-[14px] border px-3 py-2 text-left transition ${
                                  currentOffer.id === offer.id
                                    ? "border-[#8be0d2]/45 bg-[#8be0d2]/8"
                                    : "border-white/10 bg-white/4 hover:border-[#8be0d2]/35"
                                }`}
                              >
                                <span className="grid gap-1">
                                  <strong className="text-sm">
                                    {marketMeta[offer.market].label} · {offer.title}
                                  </strong>
                                  <small className="text-xs text-slate-400">{offer.note}</small>
                                </span>
                                <span className="text-right text-sm text-slate-200">
                                  {fmt(offer.price, offer.currency)}
                                  <small className="block text-xs text-slate-400">
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
              ))}
            </div>
          </div>
          <aside className="grid gap-4 xl:sticky xl:top-5">
            <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
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
                  按 1 USD = 0.7465 GBP、1 EUR = 0.8575 GBP 估算，快照日期 {snapshotDate}
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

        <section id="sources" className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-7">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Source Snapshot</p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em]">当前价格来源说明</h2>
            </div>
            <p className="max-w-[50ch] text-sm leading-7 text-slate-300">
              当前价格来自公开网页快照。不同渠道可能存在地区差异、限时活动、库存波动或新旧版本差异，点击来源按钮即可跳转核对。
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
