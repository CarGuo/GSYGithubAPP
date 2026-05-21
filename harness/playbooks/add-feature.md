# SOP — 新增功能

## 1. 立项
- 在 [harness/requirements](../requirements) 找到对应域文件，追加用户故事 / 验收标准。
- 跨多域 / 改 API → 写 ADR 到 [harness/decisions](../decisions)。

## 2. 设计
- 先在 [harness/architecture/data-flow.md](../architecture/data-flow.md) 中描绘新数据流。
- 评估对 [native-bridges.md](../architecture/native-bridges.md) 的影响。

## 3. 实现
- 复用 [components/common](../../app/components/common) / [components/widget](../../app/components/widget) 中已有控件。
- 数据访问统一通过 `dao/` 抽象，禁止页面里直接用 `fetch`。

## 4. 测试
- 至少补一条单测（utils / dao / store）+ 一条 RNTL 组件测试 + 一条 E2E（如属于关键链路）。

## 5. 收尾
- 更新对应需求文件验收标准。
- 在 [iteration/CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md) 追加。
- 跑回归 checklist。
