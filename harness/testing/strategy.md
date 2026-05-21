# 测试策略

## 金字塔

```
        ┌────────────┐
        │   Manual   │  少量、覆盖端到端关键链路（不可自动化）
        ├────────────┤
        │  E2E (Maestro) │  ~20 用例：登录 / 主流程 / 仓库 / 搜索
        ├────────────┤
        │  RNTL Component │  组件层关键交互
        ├────────────┤
        │  Jest Unit │  utils / dao / store 的纯逻辑
        └────────────┘
```

## 范围与覆盖

| 层 | 工具 | 路径 | 触发命令 |
|---|---|---|---|
| 单测 | Jest | `__tests__/unit/` | `npm test` |
| 组件 | Jest + @testing-library/react-native | `__tests__/components/` | `npm test` |
| 快照 | Jest + react-test-renderer | `__tests__/snapshots/` | `npm test -- -u` |
| E2E | [Maestro](https://maestro.mobile.dev/) | `harness/testing/e2e/` | `npm run e2e:maestro` |
| 手工 | Markdown | [manual/](./manual) | 人工 |

## 接入指南
- Jest：开箱即用，已配置 `react-native` preset。新增单测放 `__tests__/unit/<域>.test.js`。
- RNTL：升级时通过 ADR 引入 `@testing-library/react-native`，沉淀 setup 在 [rntl/README.md](./rntl/README.md)。
- Maestro：通过 `brew install maestro`（macOS）或 `curl -Ls "https://get.maestro.mobile.dev" | bash` 安装；用例为 yaml，放 [e2e/](./e2e)。

## 测试 ID 约定
- 关键交互元素 `testID="domain-screen-element"`，例如 `testID="login-page-username"`。
- 列表项使用稳定 key（仓库 fullName、issue id），避免 index。

## 取舍原则
- 不为追求覆盖率写测试；优先保护"高频回归点"与"高风险路径"。
- 一处测试只验证一件事；快照仅用于稳定 UI（避免大块文本快照）。
- 任何来自线上的 bug，回归时必须先补一条最小可复现测试。

## 维护节奏
- 每次发布前在 [regression/checklist.md](../regression/checklist.md) 中执行整套用例。
- 每季度回顾测试矩阵，淘汰过期用例（标记 `@deprecated` 后清理）。
