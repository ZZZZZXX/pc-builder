# Rig Atlas

一个可公开部署的模拟装机网站，当前版本提供：

- 主流 PC 配件目录
- 简单兼容性检查
- Amazon、Joybuy、AliExpress、官方站价格快照
- GitHub Pages 自动部署

## 本地开发

```bash
npm install
npm run dev
```

## 公开发布

仓库已经包含 GitHub Pages 工作流。

1. 推送到 `main` 分支。
2. 在 GitHub 仓库的 `Pages` 设置中把来源切到 `GitHub Actions`。
3. Actions 会自动构建 Next.js 静态导出并发布到公开链接。

## 数据说明

当前页面价格为 2026-04-09 的公开网页快照，适合先上线验证产品形态。

后续如果要升级为准实时价格站，建议继续补：

1. 服务端价格抓取或商城 API 适配器。
2. 定时更新任务与缓存层。
3. 汇率自动更新。
4. 搜索、筛选、收藏和分享装机单。
