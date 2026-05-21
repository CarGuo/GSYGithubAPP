# ADR-0003：升级 React Native 至 0.85

- **状态**：Proposed
- **日期**：2026-05-20

## 背景
- 当前 RN `0.80.2`、React `19.1.0`、新架构已开启。
- React Native 0.85 在新架构稳定性、Hermes 性能、Metro 体积上有明显改进；同时官方对 0.80 的支持窗口收窄。
- 周边生态（reanimated、screens、gesture-handler、react-navigation、realm、webview）已普遍提供 0.85 兼容版本。

## 决策
- 采取**稳健分阶段**升级：
  1. **第 0 阶段（已完成）**：基线勘察、harness 工程化沉淀。
  2. **第 1 阶段**：依赖与配置升级（package.json、babel、metro、eslint、patches 评估）。
  3. **第 2 阶段**：原生壳调整（Android Gradle/AGP/Kotlin/MainApplication；iOS Podfile/AppDelegate/use_frameworks）。
  4. **第 3 阶段**：JS 侧 API 兼容（PropTypes、AppState、新架构 props）。
  5. **第 4 阶段**：跑完整 Jest + RNTL + E2E + 手工回归。
- 详细计划见 [playbooks/rn-0.85-upgrade-plan.md](../playbooks/rn-0.85-upgrade-plan.md)。

### 强约束
- 所有目标版本必须 **发布 ≥ 15 天** 才允许采用，避免吃到刚发布的小问题。
- AI 协作不直接编辑 [package.json](../../package.json)；版本提案 + 人工执行 `npm install` 的方式落地。

## 备选方案
- **激进一次性升级**：被否决，patches 与新架构兼容风险大。
- **不升级**：被否决，长期维护成本高、新依赖只支持新版 RN。

## 影响
- 升级期内对发布节奏有影响，需要在 [iteration/release-cadence.md](../iteration/release-cadence.md) 中临时增加"upgrade freeze"窗口。
- 至少一次较大幅度的 patches 复核，可能弃用 `@react-native-community/masked-view`。
- 必须配套测试沉淀，否则风险过高。

## 回滚预案
- 升级在独立分支 `feat/rn-0.85` 推进，主干保持可发布。
- 若第 2 阶段构建失败超过 2 个工作日，回退至 0.80.2 + 关闭新架构相关副作用。
