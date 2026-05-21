# 需求 — 搜索

## 用户故事
- **US-SCH-1**：作为用户，我可以搜索仓库 / 用户 / Issue，并通过 Drawer 设置过滤条件（语言、排序、时间）。
- **US-SCH-2**：搜索历史可以快速复用。

## 关键路径与文件
- [SearchPage.js](../../app/components/SearchPage.js)
- 抽屉过滤：[SearchDrawerFilter.js](../../app/components/widget/SearchDrawerFilter.js)、[SearchFilterSelectList.js](../../app/components/widget/SearchFilterSelectList.js)
- 工具：[filterUtils.js](../../app/utils/filterUtils.js)

## 验收标准
1. 输入关键字 300ms 防抖后触发请求。
2. 切换 Tab（仓库 / 用户 / Issue）时维护各自的状态与分页。
3. Drawer 中改动过滤项后立刻发起新请求并合并到 URL/参数。

## 测试矩阵
- 单测：`__tests__/unit/filterUtils.test.js`。
- 组件：`__tests__/components/SearchDrawerFilter.test.js`。
- 手工：[manual/search.md](../testing/manual/search.md)。
