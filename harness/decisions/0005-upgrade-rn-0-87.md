# ADR-0005：升级 React Native 0.85 → 0.87

- **状态**：Proposed
- **日期**：2026-09-15
- **关联 Playbook**：[playbooks/rn-0.87-upgrade-plan.md](../playbooks/rn-0.87-upgrade-plan.md)
- **前置 ADR**：[ADR-0003](./0003-upgrade-rn-0-85.md)（0.80 → 0.85，Accepted）

## 背景
- 当前基线：`react-native@0.85.0` + `react@19.2.3` + Hermes prefab（`hermesvm`）+ 新架构（Fabric + TurboModules）已开启。
- React Native 已经发布到 `0.87.1`（npm 时间：2026-08-26），距今 20 天，满足项目"发布 ≥ 15 天"红线。
- 0.86 / 0.87 分别引入了 Node engines 提升、社区 CLI 拆分、Kotlin/Gradle 模板更新等一系列变化；生态核心库（reanimated、worklets、screens、safe-area-context）均已发布可兼容 0.87 的稳定版本。
- 0.85 → 0.87 属于跨两个大版本的升级，需要重走一遍 [playbooks/upgrade-rn.md](../playbooks/upgrade-rn.md) 通用 SOP。

## 决策
- **本轮升级**：`react-native` 0.85.0 → **0.87.1**（含 0.87.0 后的 patch 修复）。
- **Node 最低版本**：`^22.13.0`（RN 0.87 engines 官方硬要求 `^22.13.0 || ^24.3.0 || >= 26.0.0`）。项目侧 [.nvmrc](../../.nvmrc) 与 [package.json#engines](../../package.json) 同步锁到 `22.13.0`；用 [scripts/use-node.sh](../../scripts/use-node.sh) 现有隔离方案继续兜底 DevEco-Studio 内嵌 Node 18 的差异。
- **React 保持 19.2.3**：RN 0.87.1 peer 声明 `react: ^19.2.3`，无需再动。
- **Realm 保持 20.2.0**：`npm view realm dist-tags` 最新即 20.2.0，无更新可拿。
- **Lottie 保持 7.3.x**：`lottie-react-native@7.4+` 引入新 peer `@lottiefiles/dotlottie-react`，属于"新增依赖"应走独立 ADR，与本轮 RN 升级解耦。

### 生态目标版本（全部满足 15 天冷却期）

| 包 | 当前 | 目标 | 依据 |
|---|---|---|---|
| react-native | 0.85.0 | **0.87.1** | 2026-08-26 发布 / 距今 20 天 |
| @react-native/metro-config | 0.85.0 | 0.87.1 | 同 RN |
| @react-native/eslint-config | 0.85.0 | 0.87.1 | 同 RN |
| @react-native/jest-preset | 0.85.0 | 0.87.1 | 同 RN |
| react-native-reanimated | 4.3.0 | **4.6.0** | peer `RN 0.83-0.87` + 要求 worklets `0.12.x`，2026-08-21 发布 / 25 天 |
| react-native-worklets | 0.8.3 | **0.12.1** | reanimated 4.6.x 硬要求 `0.12.x`，0.12.1 发布 28 天 |
| react-native-screens | 4.24.0 | 4.27.0 | 2026-08-07 / 39 天，peer `react-native: *` |
| react-native-gesture-handler | 2.31.2 | 2.32.0 | 2026-06-11 / 96 天 |
| react-native-safe-area-context | ^5.5.2 | ^5.9.0 | 2026-08-12 / 34 天 |
| react-native-webview | ^13.15.0 | ^13.17.0 | 2026-06-20 / 87 天 |
| react / react-test-renderer | 19.2.3 | 保持 19.2.3 | RN 0.87.1 peer 匹配 |
| realm | 20.2.0 | 保持 20.2.0 | npm latest 无新版 |
| lottie-react-native | ^7.2.5（已升到 7.3.x） | 保持 7.3.x | 7.4+ 引入新 peer，超本轮范围 |
| Node（`.nvmrc` / engines） | 20.19.4 | **22.13.0** | RN 0.87 engines 硬要求 |

### 强约束（沿用 [ADR-0003](./0003-upgrade-rn-0-85.md) §强约束 + [upgrade-dependency.md](../playbooks/upgrade-dependency.md)）
- 所有目标版本必须 **发布 ≥ 15 天** 才允许采用。经 `npm view <pkg> time --json` 实测，本 ADR 列出的目标版本均已满足。
- **AI 不直接编辑 [package.json](../../package.json)**：本 ADR 只输出建议清单 + 分阶段执行 SOP，由人工在分支上执行 `npm install <pkg>@<ver>` 落地。
- 所有 `patches/` 在升级期内必须逐个跑通并 `grep -l '\.orig\|.transforms\|/build/' patches/*.patch` 全为 0（KI-019 / KI-022 经验）。

## 备选方案
- **保守方案（不升级）**：被否决，长期与生态错版本，未来 patch-package / native SDK 会持续增加维护成本。
- **激进方案（跳到 0.88 nightly / 0.87.0）**：0.88 未发正式版；0.87.0 已被 0.87.1 修 bug，直接选 0.87.1 更稳。
- **顺带升级 Lottie 到 7.5**：会引入新 peer `@lottiefiles/dotlottie-react`，与"AI 不引入新依赖"红线冲突，独立 ADR 处理。

## 影响
- **Node 主版本跳级**：`.nvmrc` 20.19.4 → 22.13.0；[package.json#engines](../../package.json) 同步；CI [.github/workflows/ci.yml](../../.github/workflows/ci.yml) 的 Node 版本也需要更新。
- **Android**：预计 Kotlin / Gradle / AGP / NDK 会跟随 0.87 模板小改。当前基线（AGP + Kotlin 2.1.20 / Gradle 8.13 / compileSdk 36 / NDK 27.1）与 0.87 模板差距不大，具体以官方 Upgrade Helper diff 为准。
- **iOS**：[Podfile](../../ios/Podfile) 与 [AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m) 大概率维持现状；`pod install` 需重新拉齐。
- **Patches**：5 个 patches 都必须复核并全量重放。
- **测试基线**：Jest 26 个单测继续跑；Metro bundle smoke（Android/iOS）继续跑；`assembleRelease` + emulator 装机闭环继续跑。

## 回滚预案
- 分支策略：**用户选择直接在 master 分支推进**，通过阶段性 commit 与 tag 保留回退点（`pre-0.87-upgrade`、`rn-0.87-phase1`…）。
- 若第 2 / 3 阶段（Android / iOS 原生）任一卡点 > 2 个工作日，`git revert` 阶段性 commit 回退到 `pre-0.87-upgrade` tag，同时把本 ADR 状态改为 `Superseded`。
- Node 22 隔离沿用 [scripts/use-node.sh](../../scripts/use-node.sh)，与 DevEco-Studio 内嵌 Node 18 完全解耦。

## 参考
- [React Native 0.87 upgrade helper diff（0.85.0 → 0.87.1）](https://react-native-community.github.io/upgrade-helper/?from=0.85.0&to=0.87.1)
- [reanimated 4.6.0 CHANGELOG](https://github.com/software-mansion/react-native-reanimated/releases/tag/%40software-mansion%2Freact-native-reanimated%404.6.0)
- [worklets 0.12.x peerDependencies](https://www.npmjs.com/package/react-native-worklets)
- [Node 22 LTS 发布节奏](https://nodejs.org/en/download/prebuilt-installer)
