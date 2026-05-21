# 需求文档索引

按业务域拆分，每个域一份独立 Markdown，便于 AI 单文件聚焦。

| 文件 | 域 | 关键页面 |
|---|---|---|
| [auth.md](./auth.md) | 登录与会话 | [LoginPage](../../app/components/LoginPage.js) / [LoginWebPage](../../app/components/LoginWebPage.js) |
| [dynamic.md](./dynamic.md) | 动态 / 通知 | [DynamicPage](../../app/components/DynamicPage.js) / [NotifyPage](../../app/components/NotifyPage.js) |
| [trending.md](./trending.md) | Trending / 推荐 | [TrendPage](../../app/components/TrendPage.js) / [RecommendPage](../../app/components/RecommendPage.js) |
| [repository.md](./repository.md) | 仓库相关 | [RepositoryDetailPage](../../app/components/RepositoryDetailPage.js) 系列 |
| [search.md](./search.md) | 搜索 | [SearchPage](../../app/components/SearchPage.js) |
| [profile.md](./profile.md) | 个人主页 / 设置 | [MyPage](../../app/components/MyPage.js) / [PersonPage](../../app/components/PersonPage.js) / [SettingPage](../../app/components/SettingPage.js) |
| [infra.md](./infra.md) | 基础设施 | i18n / 主题 / 缓存 / 日志 |

## 维护规范
- 每条需求 = 一段"用户故事 + 验收标准 + 关键页面/接口"。
- 验收标准必须可被 [harness/testing](../testing) 中的某条用例覆盖。
- 调整需求时务必同步 ADR（[harness/decisions](../decisions)）与 [iteration/CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md)。
