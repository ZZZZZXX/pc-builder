"use client";

import { useState } from "react";

type CategoryId = "cpu" | "motherboard" | "gpu" | "ram" | "ssd" | "cooler" | "psu" | "case";
type Offer = {
  id: string;
  market: "amazon" | "joybuy" | "aliexpress" | "official";
  title: string;
  price: number;
  currency: "USD" | "GBP";
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

const usdToGbp = 0.7465;
const snapshotDate = "2026-04-09";
const marketMeta = {
  amazon: { label: "Amazon", color: "#ffb703" },
  joybuy: { label: "Joybuy", color: "#8be0d2" },
  aliexpress: { label: "AliExpress", color: "#ff6b35" },
  official: { label: "官方/品牌站", color: "#8da9c4" },
} as const;

const categories: { id: CategoryId; title: string; description: string }[] = [
  { id: "cpu", title: "处理器", description: "主流游戏向 CPU，优先支持 AM5。" },
  { id: "motherboard", title: "主板", description: "检查 CPU 插槽、内存代际与板型。" },
  { id: "gpu", title: "显卡", description: "主流 1080p / 1440p 独显并显示价格渠道。" },
  { id: "ram", title: "内存", description: "默认展示 DDR5 套条。" },
  { id: "ssd", title: "固态硬盘", description: "展示 PCIe 4.0 / 5.0 NVMe 方案。" },
  { id: "cooler", title: "散热器", description: "当前示例以 360 水冷为主。" },
  { id: "psu", title: "电源", description: "结合 CPU / GPU 估算建议瓦数。" },
  { id: "case", title: "机箱", description: "检查显卡长度、主板板型与冷排空间。" },
];

const parts: Part[] = [
  {
    id: "cpu-7800x3d",
    category: "cpu",
    name: "Ryzen 7 7800X3D",
    brand: "AMD",
    summary: "经典 8 核 16 线程游戏 CPU。",
    tags: ["AM5", "8 核", "120W"],
    specs: { socket: "AM5", tdp: 120 },
    offers: [
      { id: "7800x3d-amazon", market: "amazon", title: "热门价", price: 384, currency: "USD", note: "Camel 快照", url: "https://camelcamelcamel.com/popular?bn=electronics&deal=0&p=1" },
      { id: "7800x3d-ali", market: "aliexpress", title: "快照", price: 323.96, currency: "USD", note: "PriceArchive", url: "https://no.pricearchive.org/aliexpress.com/item/1005009732232580" },
    ],
  },
  {
    id: "cpu-9800x3d",
    category: "cpu",
    name: "Ryzen 7 9800X3D",
    brand: "AMD",
    summary: "更新一代 X3D 游戏 CPU。",
    tags: ["AM5", "8 核", "高端"],
    specs: { socket: "AM5", tdp: 120 },
    offers: [{ id: "9800x3d-amazon", market: "amazon", title: "热门价", price: 419.95, currency: "USD", note: "Camel 快照", url: "https://camelcamelcamel.com/popular?deal=0" }],
  },
  {
    id: "mobo-b650",
    category: "motherboard",
    name: "MAG B650 Tomahawk WIFI",
    brand: "MSI",
    summary: "AM5 ATX 主板，适合 Ryzen 7000 / 9000。",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [{ id: "b650-joybuy", market: "joybuy", title: "快照", price: 153.99, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/msi-mag-b650-tomahawk-wifi-amd/10369430" }],
  },
  {
    id: "mobo-b850",
    category: "motherboard",
    name: "B850 Gaming Plus WIFI6E",
    brand: "MSI",
    summary: "更新一代 AM5 ATX 主板。",
    tags: ["AM5", "ATX", "DDR5"],
    specs: { socket: "AM5", formFactor: "ATX", memoryType: "DDR5" },
    offers: [{ id: "b850-joybuy", market: "joybuy", title: "快照", price: 129.98, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/msi-b850-gaming-plus-wifi6e-moederbord/10368777" }],
  },
  {
    id: "gpu-5060",
    category: "gpu",
    name: "GeForce RTX 5060 8G VENTUS 2X OC",
    brand: "MSI",
    summary: "主流 1080p / 1440p 双风扇显卡。",
    tags: ["8GB", "145W", "双风扇"],
    specs: { boardPower: 145, lengthMm: 227 },
    offers: [{ id: "5060-joybuy", market: "joybuy", title: "快照", price: 259.99, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/msi-geforce-rtx-5060-8g-ventus/10369534" }],
  },
  {
    id: "gpu-5060ti",
    category: "gpu",
    name: "RTX 5060 Ti 8GB 二手渠道价",
    brand: "GALAX",
    summary: "用于展示 AliExpress 二手价差。",
    tags: ["8GB", "180W", "二手"],
    specs: { boardPower: 180, lengthMm: 250 },
    offers: [{ id: "5060ti-ali", market: "aliexpress", title: "二手快照", price: 230.12, currency: "USD", note: "PriceArchive", url: "https://www.pricearchive.org/aliexpress.com/item/1005009678410256" }],
  },
  {
    id: "ram-crucial",
    category: "ram",
    name: "Crucial Pro DDR5 32GB 6000",
    brand: "Crucial",
    summary: "更偏性价比的 DDR5 套条。",
    tags: ["32GB", "DDR5-6000"],
    specs: { memoryType: "DDR5" },
    offers: [{ id: "ram-crucial-ali", market: "aliexpress", title: "快照", price: 53.79, currency: "USD", note: "PriceArchive", url: "https://www.pricearchive.org/aliexpress.com/item/1005009608027098" }],
  },
  {
    id: "ram-corsair",
    category: "ram",
    name: "Vengeance RGB DDR5 32GB 6000",
    brand: "Corsair",
    summary: "更偏品牌和灯效的主流套条。",
    tags: ["32GB", "DDR5-6000", "RGB"],
    specs: { memoryType: "DDR5" },
    offers: [{ id: "ram-corsair-amazon", market: "amazon", title: "价格跟踪", price: 369.99, currency: "USD", note: "camelcamelcamel", url: "https://camelcamelcamel.com/product/B0BZHTVHN5?active=price_amazon&context=popular" }],
  },
  {
    id: "ssd-990pro",
    category: "ssd",
    name: "990 PRO 1TB",
    brand: "Samsung",
    summary: "主流高性能 PCIe 4.0 SSD。",
    tags: ["1TB", "PCIe 4.0"],
    specs: { capacityTb: 1 },
    offers: [{ id: "ssd-990pro-amazon", market: "amazon", title: "热门价", price: 199.99, currency: "USD", note: "Camel 快照", url: "https://camelcamelcamel.com/popular?bn=electronics&deal=0&p=1" }],
  },
  {
    id: "ssd-arespro",
    category: "ssd",
    name: "ARES PRO 2TB Gen5 NVMe",
    brand: "Lexar",
    summary: "PCIe 5.0 NVMe SSD。",
    tags: ["2TB", "Gen5"],
    specs: { capacityTb: 2 },
    offers: [{ id: "ssd-arespro-joybuy", market: "joybuy", title: "快照", price: 249.99, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/lexar-ares-pro-2tb-gen5-nvme/10498802" }],
  },
  {
    id: "cooler-msi",
    category: "cooler",
    name: "MAG CoreLiquid I360",
    brand: "MSI",
    summary: "360 一体水冷展示方案。",
    tags: ["360 冷排", "AM5"],
    specs: { supportedSockets: ["AM5"], radiatorMm: 360 },
    offers: [{ id: "cooler-msi-joybuy", market: "joybuy", title: "快照", price: 94.99, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/msi-mag-coreliquid-i360-computer-case/10368873" }],
  },
  {
    id: "cooler-tr",
    category: "cooler",
    name: "Levita Vision 360",
    brand: "Thermalright",
    summary: "AliExpress 360 水冷快照。",
    tags: ["360 冷排", "AM5"],
    specs: { supportedSockets: ["AM5"], radiatorMm: 360 },
    offers: [{ id: "cooler-tr-ali", market: "aliexpress", title: "快照", price: 256.63, currency: "USD", note: "PriceArchive", url: "https://ms.pricearchive.org/aliexpress.com/item/1005010588582324" }],
  },
  {
    id: "psu-650",
    category: "psu",
    name: "MAG A650GL",
    brand: "MSI",
    summary: "主流级 650W 全模组电源。",
    tags: ["650W", "全模组"],
    specs: { wattage: 650 },
    offers: [{ id: "psu-650-joybuy", market: "joybuy", title: "快照", price: 69.99, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/msi-650w-atx-fully-modular-power/10369658" }],
  },
  {
    id: "psu-750",
    category: "psu",
    name: "MAG A750GL PCIE5",
    brand: "MSI",
    summary: "中高端显卡更稳妥的 750W 电源。",
    tags: ["750W", "ATX 3.0"],
    specs: { wattage: 750 },
    offers: [{ id: "psu-750-joybuy", market: "joybuy", title: "快照", price: 99.98, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/msi-750w-atx-fully-modular-power/10368859" }],
  },
  {
    id: "case-forge",
    category: "case",
    name: "MAG Forge 120A Airflow",
    brand: "MSI",
    summary: "更偏性价比的风道机箱。",
    tags: ["ATX", "风道"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 330, maxRadiatorMm: 360 },
    offers: [{ id: "case-forge-joybuy", market: "joybuy", title: "快照", price: 47.99, currency: "GBP", note: "Joybuy UK", url: "https://www.joybuy.co.uk/dp/msi-mag-forge-120a-airflow-midi/10369706" }],
  },
  {
    id: "case-h5",
    category: "case",
    name: "H5 Flow",
    brand: "NZXT",
    summary: "高风道 ATX 中塔机箱。",
    tags: ["ATX", "高风道"],
    specs: { supportedFormFactors: ["ATX", "mATX", "Mini-ITX"], maxGpuLengthMm: 365, maxRadiatorMm: 360 },
    offers: [{ id: "case-h5-official", market: "official", title: "官方商城价", price: 74.99, currency: "USD", note: "NZXT 官方", url: "https://nzxt.com/en-US/product/h5-flow" }],
  },
];

const presets = [
  { id: "balanced", name: "平衡型游戏主机", parts: { cpu: "cpu-7800x3d", motherboard: "mobo-b650", gpu: "gpu-5060", ram: "ram-crucial", ssd: "ssd-990pro", cooler: "cooler-msi", psu: "psu-650", case: "case-forge" } },
  { id: "premium", name: "高配流畅型", parts: { cpu: "cpu-9800x3d", motherboard: "mobo-b850", gpu: "gpu-5060ti", ram: "ram-corsair", ssd: "ssd-arespro", cooler: "cooler-tr", psu: "psu-750", case: "case-h5" } },
] as const;

const partsById = new Map(parts.map((part) => [part.id, part]));
const toGbp = (price: number, currency: Offer["currency"]) => (currency === "USD" ? price * usdToGbp : price);
const fmt = (price: number, currency: Offer["currency"]) => new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(price);
const gbp = (price: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(price);
const byCategory = (categoryId: CategoryId) => parts.filter((part) => part.category === categoryId);
const cheapest = (part: Part) => [...part.offers].sort((a, b) => toGbp(a.price, a.currency) - toGbp(b.price, b.currency))[0];
const chosenOffer = (part: Part, offerId?: string) => part.offers.find((offer) => offer.id === offerId) ?? cheapest(part);
const offerMapFrom = (selected: Record<CategoryId, string>) =>
  Object.fromEntries(Object.entries(selected).map(([categoryId, partId]) => [categoryId, cheapest(partsById.get(partId)!).id])) as Record<CategoryId, string>;

export default function Home() {
  const [presetId, setPresetId] = useState<string>(presets[0].id);
  const [selectedParts, setSelectedParts] = useState<Record<CategoryId, string>>(presets[0].parts);
  const [selectedOffers, setSelectedOffers] = useState<Record<CategoryId, string>>(offerMapFrom(presets[0].parts));
  const activePreset = presets.find((preset) => preset.id === presetId) ?? presets[0];
  const isCustomBuild = JSON.stringify(selectedParts) !== JSON.stringify(activePreset.parts);

  const selectedPartRecord = Object.fromEntries(categories.map((category) => [category.id, partsById.get(selectedParts[category.id])!])) as Record<CategoryId, Part>;
  const selectedOfferRecord = Object.fromEntries(categories.map((category) => [category.id, chosenOffer(selectedPartRecord[category.id], selectedOffers[category.id])])) as Record<CategoryId, Offer>;
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
      status: String(selectedPartRecord.ram.specs.memoryType) === String(selectedPartRecord.motherboard.specs.memoryType) ? "pass" : "fail",
      text:
        String(selectedPartRecord.ram.specs.memoryType) === String(selectedPartRecord.motherboard.specs.memoryType)
          ? `内存代际匹配：${String(selectedPartRecord.ram.specs.memoryType)}`
          : `主板要求 ${String(selectedPartRecord.motherboard.specs.memoryType)}，当前内存为 ${String(selectedPartRecord.ram.specs.memoryType)}`,
    },
    {
      status: (selectedPartRecord.cooler.specs.supportedSockets as string[]).includes(String(selectedPartRecord.cpu.specs.socket)) ? "pass" : "fail",
      text: (selectedPartRecord.cooler.specs.supportedSockets as string[]).includes(String(selectedPartRecord.cpu.specs.socket)) ? `散热器支持 ${String(selectedPartRecord.cpu.specs.socket)}` : `散热器未声明支持 ${String(selectedPartRecord.cpu.specs.socket)}`,
    },
    {
      status: (selectedPartRecord.case.specs.supportedFormFactors as string[]).includes(String(selectedPartRecord.motherboard.specs.formFactor)) ? "pass" : "fail",
      text: (selectedPartRecord.case.specs.supportedFormFactors as string[]).includes(String(selectedPartRecord.motherboard.specs.formFactor)) ? `机箱支持 ${String(selectedPartRecord.motherboard.specs.formFactor)} 主板` : `机箱不支持 ${String(selectedPartRecord.motherboard.specs.formFactor)} 主板`,
    },
    {
      status: Number(selectedPartRecord.case.specs.maxGpuLengthMm) >= Number(selectedPartRecord.gpu.specs.lengthMm) ? "pass" : "warn",
      text: Number(selectedPartRecord.case.specs.maxGpuLengthMm) >= Number(selectedPartRecord.gpu.specs.lengthMm) ? `显卡长度 ${Number(selectedPartRecord.gpu.specs.lengthMm)}mm 在机箱限制内` : "显卡长度接近机箱极限，请再核对机箱详情页",
    },
    {
      status: Number(selectedPartRecord.case.specs.maxRadiatorMm) >= Number(selectedPartRecord.cooler.specs.radiatorMm) ? "pass" : "warn",
      text: Number(selectedPartRecord.case.specs.maxRadiatorMm) >= Number(selectedPartRecord.cooler.specs.radiatorMm) ? `机箱可容纳 ${Number(selectedPartRecord.cooler.specs.radiatorMm)}mm 冷排` : `请再确认机箱是否支持 ${Number(selectedPartRecord.cooler.specs.radiatorMm)}mm 冷排`,
    },
    {
      status: Number(selectedPartRecord.psu.specs.wattage) >= Number(selectedPartRecord.cpu.specs.tdp) + Number(selectedPartRecord.gpu.specs.boardPower) + 180 ? "pass" : "warn",
      text: Number(selectedPartRecord.psu.specs.wattage) >= Number(selectedPartRecord.cpu.specs.tdp) + Number(selectedPartRecord.gpu.specs.boardPower) + 180 ? `电源 ${Number(selectedPartRecord.psu.specs.wattage)}W 覆盖建议值` : "建议再提高电源瓦数余量",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,107,53,0.22),transparent_22rem),radial-gradient(circle_at_top_right,rgba(139,224,210,0.18),transparent_24rem),linear-gradient(180deg,#07111f_0%,#0a1728_48%,#08111d_100%)] text-white">
      <div className="mx-auto flex w-[min(calc(100%-20px),1400px)] flex-col gap-5 py-5 md:w-[min(calc(100%-32px),1400px)] md:py-7">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,420px)]">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-11">
            <p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Rig Atlas</p>
            <h1 className="max-w-[12ch] text-5xl leading-none font-semibold tracking-[-0.04em] md:text-7xl">模拟装电脑主机，同时看跨站价格。</h1>
            <p className="mt-5 max-w-[62ch] text-base leading-7 text-slate-300">面向公开访问部署的装机站点，内置主流 PC 配件目录、兼容性检查、价格汇总和渠道跳转。当前快照覆盖 Amazon、Joybuy、AliExpress，并保留官方直销入口作为补充。</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#builder" className="inline-flex min-h-12 items-center justify-center rounded-full bg-linear-to-br from-[#ff6b35] to-[#ff8f5e] px-5 text-sm font-bold text-[#09111d]">开始选配</a>
              <a href="#sources" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm">查看价格来源</a>
            </div>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,107,53,0.16),transparent_36%),linear-gradient(200deg,rgba(139,224,210,0.13),transparent_45%),rgba(14,28,48,0.94)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
            {[
              ["快照日期", snapshotDate],
              ["已接入市场", "Amazon / Joybuy / AliExpress"],
              ["部署方式", "GitHub Pages"],
              ["更新策略", "静态快照，可继续接 API"],
            ].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-none last:pb-0"><span className="text-slate-300">{label}</span><strong className="text-right">{value}</strong></div>)}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["8", "核心分类"],
            ["16", "已整理配件"],
            ["4", "价格来源类型"],
            ["1", "可直接公开部署站点"],
          ].map(([value, label]) => <article key={label} className="rounded-[20px] border border-white/10 bg-white/5 px-6 py-5"><span className="block text-3xl font-extrabold tracking-[-0.04em]">{value}</span><span className="text-slate-300">{label}</span></article>)}
        </section>

        <section className="grid gap-4 rounded-[28px] border border-white/10 bg-[linear-gradient(90deg,rgba(255,107,53,0.12),transparent_22%),rgba(255,255,255,0.03)] px-8 py-7 md:grid-cols-2">
          <div><p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Market Coverage</p><h2 className="text-3xl leading-tight font-semibold tracking-[-0.04em]">先做公开可访问版本，再继续把实时抓价接上去。</h2></div>
          <p className="text-base leading-7 text-slate-300">这个版本采用“可运行站点 + 价格快照 + 结构化数据层”的方式，适合先上线验证。后续如果你要接更实时的价格抓取，只需要补充价格适配器，不需要推翻页面。</p>
        </section>

        <section id="builder" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.72fr)]">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-7">
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div><p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Builder</p><h2 className="text-4xl font-semibold tracking-[-0.04em]">主流装机配件目录</h2></div>
              <p className="max-w-[48ch] text-sm leading-7 text-slate-300">点击每一类中的配件卡片即可切换方案。每张卡片下方可以继续切换当前采用的价格来源。</p>
            </div>
            <div className="mb-5 rounded-[20px] border border-[#8be0d2]/25 bg-[#8be0d2]/8 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <strong className="block text-sm text-[#8be0d2]">DIY 自定义装机</strong>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    预设只是快捷入口。你可以自己逐项选择 CPU、主板、显卡、内存、SSD、电源、机箱和散热器，
                    页面会同步刷新每个配件价格与整机总价。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOffers(() =>
                        Object.fromEntries(
                          categories.map((category) => [
                            category.id,
                            cheapest(partsById.get(selectedParts[category.id])!).id,
                          ])
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
              {presets.map((preset) => <button key={preset.id} type="button" onClick={() => { setPresetId(preset.id); setSelectedParts(preset.parts); setSelectedOffers(offerMapFrom(preset.parts)); }} className={`rounded-full border px-4 py-2 text-sm transition ${presetId === preset.id ? "border-[#ff6b35]/70 bg-[#ff6b35]/15" : "border-white/10 bg-white/5 hover:border-[#ff6b35]/60 hover:bg-[#ff6b35]/10"}`}>{preset.name}</button>)}
            </div>
            <div className="grid gap-5">
              {categories.map((category) => <section key={category.id} className="rounded-[20px] border border-white/10 bg-white/4 p-5">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div><h3 className="text-xl font-semibold">{category.title}</h3><p className="mt-2 max-w-[58ch] text-sm leading-7 text-slate-300">{category.description}</p></div>
                  <span className="w-fit rounded-full border border-[#8be0d2]/30 px-3 py-2 text-sm text-[#8be0d2]">{byCategory(category.id).length} 个已整理选项</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {byCategory(category.id).map((part) => {
                    const currentOffer = chosenOffer(part, selectedOffers[category.id]);
                    return <article key={part.id} className={`rounded-[18px] border bg-[#0a1728]/90 p-4 transition ${selectedParts[category.id] === part.id ? "border-[#ff6b35]/60" : "border-white/10 hover:border-[#ff6b35]/45"}`}>
                      <button type="button" onClick={() => { setSelectedParts((prev) => ({ ...prev, [category.id]: part.id })); setSelectedOffers((prev) => ({ ...prev, [category.id]: cheapest(part).id })); }} className="block w-full text-left">
                        <div className="flex items-start justify-between gap-3"><div><h4 className="text-lg leading-6 font-medium">{part.name}</h4><p className="mt-1 text-sm text-slate-400">{part.brand}</p></div><span className="rounded-xl bg-[#8be0d2]/10 px-3 py-2 text-sm font-bold text-[#8be0d2]">{gbp(toGbp(cheapest(part).price, cheapest(part).currency))}</span></div>
                        <p className="mt-4 min-h-14 text-sm leading-6 text-slate-300">{part.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-2">{part.tags.map((tag) => <span key={tag} className="rounded-full bg-white/6 px-2.5 py-1.5 text-xs text-slate-200">{tag}</span>)}</div>
                      </button>
                      <div className="mt-4 grid gap-2">
                        {part.offers.map((offer) => <button key={offer.id} type="button" onClick={() => setSelectedOffers((prev) => ({ ...prev, [category.id]: offer.id }))} className={`flex w-full items-start justify-between gap-3 rounded-[14px] border px-3 py-2 text-left transition ${currentOffer.id === offer.id ? "border-[#8be0d2]/45 bg-[#8be0d2]/8" : "border-white/10 bg-white/4 hover:border-[#8be0d2]/35"}`}>
                          <span className="grid gap-1"><strong className="text-sm">{marketMeta[offer.market].label} · {offer.title}</strong><small className="text-xs text-slate-400">{offer.note}</small></span>
                          <span className="text-right text-sm text-slate-200">{fmt(offer.price, offer.currency)}<small className="block text-xs text-slate-400">≈ {gbp(toGbp(offer.price, offer.currency))}</small></span>
                        </button>)}
                      </div>
                    </article>;
                  })}
                </div>
              </section>)}
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
              <h2 className="text-3xl font-semibold tracking-[-0.04em]">{selectedPartRecord.cpu.name} + {selectedPartRecord.gpu.name}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">{selectedPartRecord.motherboard.name} / {selectedPartRecord.ram.name} / {selectedPartRecord.case.name}</p>
              <div className="mt-5 rounded-[20px] bg-[linear-gradient(135deg,rgba(255,107,53,0.16),rgba(255,107,53,0.04)),rgba(255,255,255,0.03)] p-5"><span className="block text-sm text-slate-300">预估总价</span><strong className="mt-2 block text-4xl tracking-[-0.04em]">{gbp(total)}</strong><small className="block text-sm text-slate-400">按 1 USD = 0.7465 GBP 估算，快照日期 {snapshotDate}</small></div>
            </section>
            <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
              <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">已选配件</h3><span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">{categories.length} / {categories.length}</span></div>
              <div className="grid gap-2.5">{categories.map((category) => <div key={category.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3"><strong className="block text-sm">{category.title} · {selectedPartRecord[category.id].name}</strong><small className="text-xs leading-6 text-slate-400">{marketMeta[selectedOfferRecord[category.id].market].label} · {fmt(selectedOfferRecord[category.id].price, selectedOfferRecord[category.id].currency)} · 约 {gbp(toGbp(selectedOfferRecord[category.id].price, selectedOfferRecord[category.id].currency))}</small><a href={selectedOfferRecord[category.id].url} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-[#8be0d2]/40">查看当前价格来源</a></div>)}</div>
            </section>
            <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
              <h3 className="mb-4 text-lg font-semibold">兼容性检查</h3>
              <div className="grid gap-2.5">{compatibility.map((item) => <div key={item.text} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3"><span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${item.status === "pass" ? "bg-emerald-400" : item.status === "warn" ? "bg-amber-300" : "bg-rose-400"}`} /><span className="text-sm text-slate-200">{item.text}</span></div>)}</div>
            </section>
            <section className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
              <h3 className="mb-4 text-lg font-semibold">渠道分布</h3>
              <div className="grid gap-2.5">{Object.entries(marketSpend).map(([market, value]) => <div key={market} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3"><div><strong className="block text-sm">{marketMeta[market as keyof typeof marketMeta].label}</strong><small className="text-xs text-slate-400">{gbp(value)}</small></div><div className="h-2 w-32 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${Math.max((value / total) * 100, 8)}%`, background: marketMeta[market as keyof typeof marketMeta].color }} /></div></div>)}</div>
            </section>
          </aside>
        </section>

        <section id="sources" className="rounded-[28px] border border-white/10 bg-[rgba(9,20,36,0.82)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] md:p-7">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div><p className="mb-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#8be0d2]">Source Snapshot</p><h2 className="text-4xl font-semibold tracking-[-0.04em]">当前价格来源说明</h2></div>
            <p className="max-w-[50ch] text-sm leading-7 text-slate-300">当前页面中的价格来自公开网页快照。不同渠道可能存在版本差异、库存差异、二手与全新差异，点击来源按钮可直接跳转核对。</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{categories.map((category) => <article key={category.id} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-4"><h3 className="text-base font-semibold">{category.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{category.description}</p><p className="mt-2 text-xs text-slate-400">价格快照日期：{snapshotDate}</p><div className="mt-4 flex flex-wrap gap-2">{byCategory(category.id).flatMap((part) => part.offers.map((offer) => <a key={offer.id} href={offer.url} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-[#ff6b35]/60">{marketMeta[offer.market].label} · {part.name}</a>))}</div></article>)}</div>
        </section>
      </div>
    </main>
  );
}
