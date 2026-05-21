# ADR-0001：使用 ADR 记录架构决策

- **状态**：Accepted
- **日期**：2026-05-20
- **背景**：项目历经 RN 0.51 → 0.74 → 0.80 多次升级与重构，关键决策（路由切换、Realm 引入、新架构开启等）缺乏可追溯的记录。
- **决策**：所有"难逆转 / 影响多模块"的决策必须落入 [harness/decisions](.) 目录，编号递增，命名 `NNNN-kebab-title.md`。
- **结果**：
  - 提供给 AI 协作工具与新成员一份"项目大脑"。
  - 与 [harness/iteration/CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md) 共同形成时间线。

## ADR 模板
```
# ADR-NNNN: 标题

- 状态：Proposed | Accepted | Superseded by ADR-XXXX
- 日期：YYYY-MM-DD
- 背景：...
- 决策：...
- 备选方案：...
- 影响：...
```
