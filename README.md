# Rig Atlas

公开可访问的 DIY 装机网站，支持：
- 按分类和品牌浏览主流 PC 配件
- 自定义 CPU、主板、显卡、内存、SSD、散热器、电源和机箱
- 查看 Amazon、Joybuy、AliExpress、Best Buy 与品牌商城价格快照
- GitHub Pages 自动部署

## 本地开发

```bash
npm install
npm run dev
```

## 公开发布

仓库已经包含 GitHub Pages 工作流：
1. 推送到 `main` 分支。
2. 在 GitHub 仓库的 `Pages` 设置中把来源切到 `GitHub Actions`。
3. Actions 会自动构建 Next.js 静态导出并发布到公开链接。

## 搜索引擎收录

项目现在已经包含：
- `robots.txt`
- `sitemap.xml`
- `manifest.webmanifest`
- 首页结构化数据
- 基础 Open Graph / Twitter / canonical metadata

建议继续做这几步：
1. 保持站点公开可访问。
2. 到 Google Search Console 提交 `https://zzzzzxx.github.io/pc-builder/sitemap.xml`。
3. 到 Bing Webmaster Tools 提交同一个 sitemap。
4. 如果想更容易被搜索到，后续建议绑定自定义域名，再重新提交新域名的 sitemap。

## 数据说明

当前第三方渠道价格以公开网页快照和可核对来源为主，适合公开展示与产品验证。

如果后续要升级成更实时的价格站，建议继续补充：
1. 服务端采价或官方商城 API 适配。
2. 定时更新任务与缓存层。
3. 汇率自动更新。
4. 搜索、筛选、收藏和装机单分享。
