# 需求 — Trending / 推荐

## 用户故事
- **US-TRD-1**：作为用户，我可以按"今日 / 本周 / 本月"和语言筛选 GitHub Trending 仓库。
- **US-TRD-2**：作为用户，我可以查看推荐位 / 编辑精选（[RecommendPage](../../app/components/RecommendPage.js)）。

## 关键路径与文件
- [TrendPage.js](../../app/components/TrendPage.js)
- [RecommendPage.js](../../app/components/RecommendPage.js)
- [TrendingUtil.js](../../app/utils/trending/TrendingUtil.js) / [GitHubTrending.js](../../app/utils/trending/GitHubTrending.js) / [StringUtil.js](../../app/utils/trending/StringUtil.js)

## 验收标准
1. 切换时间维度 / 语言筛选时列表立即刷新，loading 期间不阻塞 UI。
2. Trending 抓取失败时显示空态 + 重试。
3. 推荐位条目点击跳转仓库详情。

## 测试矩阵
- 单测：`__tests__/unit/TrendingUtil.test.js`（HTML 解析正确性，使用固定 fixture）。
- 组件：`__tests__/components/TrendPage.test.js`（mock 解析结果）。
- 手工：[manual/trending.md](../testing/manual/trending.md)。
