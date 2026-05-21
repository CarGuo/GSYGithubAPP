# 需求 — 动态 / 通知

## 用户故事
- **US-DYN-1**：作为登录用户，我可以在动态 Tab 看到关注用户、关注仓库的事件流，按时间倒序。
- **US-DYN-2**：作为用户，我可以下拉刷新、上拉加载更多。
- **US-DYN-3**：作为用户，我可以查看 Notify（评论、Issue、Mention）通知，并标记为已读。
- **US-DYN-4**：在弱网下应能从 Realm 缓存读取上一次内容。

## 关键路径与文件
- [DynamicPage.js](../../app/components/DynamicPage.js)
- [NotifyPage.js](../../app/components/NotifyPage.js)
- [eventDao.js](../../app/dao/eventDao.js) — `getNewsEvent`、`getUserEvent`
- [issueDao.js](../../app/dao/issueDao.js) — Notification 部分
- [eventUtils.js](../../app/utils/eventUtils.js) — 文案与跳转
- [PullLoadMoreListView.js](../../app/components/widget/PullLoadMoreListView.js)

## 验收标准
1. 进入动态页 200ms 内显示骨架/缓存数据，1s 内完成首次刷新。
2. 列表项点击根据 type 跳转对应详情页（仓库/Issue/PR/User）。
3. 通知列表中标记单条 / 全部已读后立即更新 UI；离线下可走缓存策略。

## 测试矩阵
- 单测：`__tests__/unit/eventUtils.test.js`（文案模板、跳转目标）、`__tests__/unit/eventDao.test.js`（mock）。
- 组件：`__tests__/components/EventItem.test.js`。
- 手工：[manual/dynamic.md](../testing/manual/dynamic.md)。
