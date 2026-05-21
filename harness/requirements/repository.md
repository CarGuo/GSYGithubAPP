# 需求 — 仓库

## 用户故事
- **US-REPO-1**：作为用户，我可以查看仓库详情，包含 README、Star/Fork/Watch、Owner、Topics。
- **US-REPO-2**：我可以浏览仓库文件树并查看代码（含语法高亮）。
- **US-REPO-3**：我可以查看仓库 Issue / PR 列表，并对自己的 Issue 进行评论。
- **US-REPO-4**：我可以查看 Pulse、Release、Activity（提交历史）。
- **US-REPO-5**：我可以 Star / Unstar、Watch / Unwatch、Fork。

## 关键路径与文件
- 详情：[RepositoryDetailPage.js](../../app/components/RepositoryDetailPage.js)
- 文件：[RepositoryDetailFilePage.js](../../app/components/RepositoryDetailFilePage.js)
- 活动：[RepositoryDetailActivityPage.js](../../app/components/RepositoryDetailActivityPage.js)
- Issue 列表：[RepositoryIssueListPage.js](../../app/components/RepositoryIssueListPage.js)、详情 [IssueDetailPage.js](../../app/components/IssueDetailPage.js)
- 代码 / Md：[CodeDetailPage.js](../../app/components/CodeDetailPage.js) + [htmlUtils.js](../../app/utils/htmlUtils.js)
- 数据：[repositoryDao.js](../../app/dao/repositoryDao.js)、[issueDao.js](../../app/dao/issueDao.js)
- Pulse：[PulseUtils.js](../../app/utils/pulse/PulseUtils.js)

## 验收标准
1. 仓库详情进入 < 1s（缓存优先）。
2. 文件树点击进入子目录或代码页，代码页支持语法高亮、行号显示。
3. Issue 列表分页正确，支持过滤 open / closed / all。
4. Star / Unstar 操作即时更新 UI 状态并写入 Realm。

## 测试矩阵
- 单测：`__tests__/unit/htmlUtils.test.js`（getFullName / launchUrl / parseDiffSource 边界）。
- 单测：`__tests__/unit/repositoryDao.test.js`（mock GraphQL/REST，关键解析路径）。
- 组件：`__tests__/components/RepositoryHeader.test.js`、`__tests__/components/IssueItem.test.js`。
- E2E：`harness/testing/e2e/repository.spec.js`（进入仓库 → README → 文件树）。
- 手工：[manual/repository.md](../testing/manual/repository.md)。
