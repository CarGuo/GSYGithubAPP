# RFC — React Native 0.85 → 0.87 升级计划

- **状态**：🟡 阶段一进行中（ADR + Node 目标锁定；依赖 `npm install` 待人工执行）
- **关联 ADR**：[ADR-0005](../decisions/0005-upgrade-rn-0-87.md)
- **基线版本**：RN `0.85.0` + React `19.2.3` + realm `20.2.0` + Node `.nvmrc=20.19.4`
- **目标版本**：RN **`0.87.1`** + Node **`22.13.0`**（RN 0.87 engines `^22.13.0 || ^24.3.0 || >= 26.0.0` 硬要求）
- **分支**：master（用户明确选择直接主干推进，配阶段性 commit + tag 兜底）
- **执行人**：AI 协作 + 人工执行 `npm install` / `pod install` / gradle build

## 目录
1. 范围与目标
2. 依赖升级矩阵
3. 阶段拆分
4. 需人工执行的命令清单
5. 原生改动清单（Android / iOS）
6. patches 影响评估
7. 风险与回滚
8. 验收标准
9. 进度看板

---

## 1. 范围与目标
- 升级 React Native 主框架到 **0.87.1**（0.87 系列最新稳定 patch，满 15 天冷却）。
- Node 底座从 `20.19.4` 拉到 `22.13.0`（RN 0.87 engines 硬要求）。
- 同步升级"与 RN 强耦合"的核心库到与 0.87 兼容的最低稳定版本。
- 保持新架构开启状态（Fabric + TurboModules）；保持 Hermes 默认开启。
- 不主动重构业务代码；**不引入新依赖**（Lottie 7.4/7.5 引入 `@lottiefiles/dotlottie-react` 的诉求延后独立 ADR）。

### 1.1 版本红线（沿用 [ADR-0003](../decisions/0003-upgrade-rn-0-85.md) §1.1）
- **15 天冷却期**：本 RFC 列出的所有目标版本均已实测满足（详见 §2）。
- **AI 不直接改 [package.json](../../package.json)**：本 RFC §4 给出人工需执行的 `npm install` 命令清单，人工在 master 上执行，AI 负责后续所有 native / doc / test 改动。
- **patches**：升级期内必须全量重放；`grep -l '\.orig\|.transforms\|/build/' patches/*.patch` 必须为 0。

## 2. 依赖升级矩阵

| 类别 | 包 | 当前 | 目标 | npm 发布时间 | 距今 | 备注 |
|---|---|---|---|---|---|---|
| 核心 | react-native | 0.85.0 | **0.87.1** | 2026-08-26 | 20 天 | engines `^22.13.0 \|\| ^24.3.0 \|\| >=26.0.0` |
| 核心 | @react-native/metro-config | 0.85.0 | 0.87.1 | 2026-08-26 | 20 天 | 与 RN 对齐 |
| 核心 | @react-native/eslint-config | 0.85.0 | 0.87.1 | 2026-08-26 | 20 天 | 同上 |
| 核心 | @react-native/jest-preset | 0.85.0 | 0.87.1 | 2026-08-26 | 20 天 | 同上 |
| 核心 | @react-native-community/cli | ^20.0.0 | ^20.0.0（保持 latest tag） | — | — | `dist-tags.latest=20.2.0` |
| 动画 | react-native-reanimated | 4.3.0 | **4.6.0** | 2026-08-21 | 25 天 | peer `RN 0.83-0.87` + `worklets 0.12.x` |
| 动画 | react-native-worklets | 0.8.3 | **0.12.1** | 2026-08-18 | 28 天 | reanimated 4.6 硬绑定 |
| 屏幕 | react-native-screens | 4.24.0 | 4.27.0 | 2026-08-07 | 39 天 | peer `react-native: *` |
| 手势 | react-native-gesture-handler | 2.31.2 | 2.32.0 | 2026-06-11 | 96 天 | peer `react-native: *` |
| 安全区 | react-native-safe-area-context | ^5.5.2 | ^5.9.0 | 2026-08-12 | 34 天 | peer `react-native: *` |
| WebView | react-native-webview | ^13.15.0 | ^13.17.0 | 2026-06-20 | 87 天 | peer `react-native: *` |
| React 生态 | react / react-test-renderer | 19.2.3 | 保持 19.2.3 | — | — | RN 0.87.1 peer `^19.2.3` |
| 数据 | realm | 20.2.0 | 保持 20.2.0 | — | — | npm `dist-tags.latest=20.2.0` |
| 动画 | lottie-react-native | ^7.2.5 (实际 7.3.x) | 保持 7.3.x | — | — | 7.4/7.5 引入新 peer；本轮不升 |
| 底座 | Node（.nvmrc / engines） | 20.19.4 | **22.13.0** | Node 22 LTS 早已 GA | — | RN 0.87 engines 硬要求 |

## 3. 阶段拆分

### 阶段 0：准备（AI 已完成）
1. `git pull` 拉取 origin/master → 已完成，工作树干净。
2. 写 ADR-0005 与本 RFC → 已完成。
3. 更新 [.nvmrc](../../.nvmrc)：`20.19.4 → 22.13.0` → 待 AI 执行（本轮内）。

### 阶段 1：JS 依赖升级（**人工执行 `npm install`**）
1. 阶段前建议先在 master 打 tag：`git tag pre-0.87-upgrade`（回退兜底）。
2. **人工执行** [§4 命令清单](#4-需人工执行的命令清单)。
3. `postinstall` 阶段 patch-package 会自动跑 5 个 patches，注意观察是否有 `did not apply` 警告。
4. 执行 `npm run node:check` 确认 Node 22.13+ 已切换生效。
5. 执行 `npm test`；如失败先看是否 `@react-native/jest-preset` 更新导致 mock 需要跟进。
6. 执行 `npm run lint`。
7. 执行 `npm run bundle:android:smoke` / `npm run bundle:ios:smoke`；两个 bundle 都能出即代表 JS 层已过。
8. `git add -p` + commit：`chore(rn-0.87): phase1 js deps upgrade`；打 tag `rn-0.87-phase1`。

### 阶段 2：原生 Android（AI 主导 + 人工触发构建）
1. 阅读 [RN 0.87 upgrade helper diff](https://react-native-community.github.io/upgrade-helper/?from=0.85.0&to=0.87.1) 拿到 template 侧的 Android 变化。
2. 视差异更新 [android/build.gradle](../../android/build.gradle) 的 `kotlinVersion` / `ndkVersion` / `compileSdk`、[gradle-wrapper.properties](../../android/gradle/wrapper/gradle-wrapper.properties) 的 Gradle 版本、[android/app/build.gradle](../../android/app/build.gradle) 里的 `react { ... }` 节点新字段。
3. 人工执行 `cd android && ./gradlew clean assembleDebug`；失败按 [KI-008/009/010/011](../regression/known-issues.md) 类似方式定位第三方原生库 ABI 断层，必要时再补 patch。
4. 通过后 `./gradlew assembleRelease`（**必须 assembleRelease，不能 bundleRelease**，见 [checklist.md §8.2](../regression/checklist.md)）。
5. 安装 APK 到模拟器，logcat 观察是否有 fatal / SIGSEGV。
6. commit：`chore(rn-0.87): phase2 android native`；打 tag `rn-0.87-phase2`。

### 阶段 3：原生 iOS（AI 主导 + 人工触发构建）
1. 检查 [ios/Podfile](../../ios/Podfile) 与 [AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m) 是否需要跟进 0.87 template（若 `min_ios_version_supported` 变化则同步）。
2. 人工执行 `rm -rf ios/Pods ios/Podfile.lock ios/build && cd ios && pod install`。
3. `xcodebuild -workspace GSYGithubApp.xcworkspace -scheme GSYGithubApp -configuration Debug -sdk iphonesimulator`。
4. `simctl install` + `simctl launch`，观察是否有 EXC_BAD_ACCESS。realm 20.2.0 已修 KI-016 的段错根因，理论上直接过。
5. commit：`chore(rn-0.87): phase3 ios native`；打 tag `rn-0.87-phase3`。

### 阶段 4：JS API 兼容 + 三方库适配
- 关注 0.86 / 0.87 release notes 中的 breaking：`AppState` / `Linking` / `Image` / `SafeAreaView` 等。
- 关注新架构下的 props 透传变化。
- 每个 API 断点写单测复现，修完再关。

### 阶段 5：回归（对齐 [checklist.md §8](../regression/checklist.md)）
- `npm test` / `npm run lint`；
- Metro bundle smoke 双平台；
- Android `assembleRelease` + emulator 装机 + logcat 无 fatal + 关键页面截图；
- Android `.so` 16KB 校验（保持 KI-013 已修状态）；
- iOS Debug + Release 装机；
- 手工回归 [harness/testing/manual/](../testing/manual/)。

### 阶段 6：发布与文档
- 追加 [CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md) 一条完整复盘（"改了什么 / 为何这么改 / 测试与验证"三段式）。
- 关闭本 RFC 与 [ADR-0005](../decisions/0005-upgrade-rn-0-87.md) 状态为 Accepted。
- 更新 [README.md](../../README.md) 中 "RN 0.85.0" → "RN 0.87.1"。

## 4. 需人工执行的命令清单

> 前置：确保本机 Node 22.13+ 可用（`n install 22.13.0` 或 `nvm install 22.13.0`）。
> AI 已把 [.nvmrc](../../.nvmrc) 设为 `22.13.0`，[scripts/use-node.sh](../../scripts/use-node.sh) 会自动读取。

```bash
# 0. 打回退 tag
git tag pre-0.87-upgrade

# 1. 切换到项目内 Node 22
bash scripts/use-node.sh node --version   # 应输出 v22.13.0（首次可能触发 n install）

# 2. 核心 RN 全家桶（严格锁版）
bash scripts/use-node.sh npm install --save-exact \
  react-native@0.87.1 \
  react-native-reanimated@4.6.0 \
  react-native-worklets@0.12.1 \
  react-native-screens@4.27.0 \
  react-native-gesture-handler@2.32.0

# 3. dev 依赖（严格锁版）
bash scripts/use-node.sh npm install --save-dev --save-exact \
  @react-native/metro-config@0.87.1 \
  @react-native/eslint-config@0.87.1 \
  @react-native/jest-preset@0.87.1

# 4. 半锁版（沿用 ^）
bash scripts/use-node.sh npm install --save \
  react-native-safe-area-context@^5.9.0 \
  react-native-webview@^13.17.0

# 5. patch-package 已在 postinstall 自动跑，观察输出确认 5 个 patch 全 ✔
#    若有 "did not apply" 立刻停手，把日志贴给 AI 分析

# 6. JS 层 smoke（Node 22 上）
bash scripts/use-node.sh npm test
bash scripts/use-node.sh npm run lint
bash scripts/use-node.sh npm run bundle:android:smoke
bash scripts/use-node.sh npm run bundle:ios:smoke

# 7. 阶段一 commit
git add package.json package-lock.json .nvmrc harness/
git commit -m "chore(rn-0.87): phase1 js deps 0.85.0 -> 0.87.1 + node 22.13"
git tag rn-0.87-phase1
```

- **注意 §4 步骤 2 一定要 `--save-exact`**：core 全家桶精准锁，避免 `^` 未来悄悄升。
- **注意 §4 步骤 3 也要 `--save-exact`**：dev 依赖里的 metro-config / eslint-config / jest-preset 必须严格与 RN 版本对齐。
- 若 postinstall 抛错（patch-package 静默失效双坑再现），立刻回退到 `pre-0.87-upgrade` tag 并联系 AI 修补 patch 头部。

## 5. 原生改动清单

### Android（AI 会根据 0.87 template diff 主导）
- [android/gradle/wrapper/gradle-wrapper.properties](../../android/gradle/wrapper/gradle-wrapper.properties)：Gradle 版本
- [android/build.gradle](../../android/build.gradle)：`kotlinVersion` / `ndkVersion` / `compileSdk` / `buildToolsVersion`
- [android/app/build.gradle](../../android/app/build.gradle)：`react { ... }` 节点新字段（若有）
- [MainApplication.java](../../android/app/src/main/java/com/gsygithubapp/MainApplication.java)：API 改名（若 template 改动）
- [android/init.gradle](../../android/init.gradle)：与 KI-018 一起考虑

### iOS
- [ios/Podfile](../../ios/Podfile)：`min_ios_version_supported`（若 template 提升）
- [AppDelegate.h / AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m)：`RCTAppDependencyProvider` 接口若有改动
- [project.pbxproj](../../ios/GSYGithubApp.xcodeproj/project.pbxproj)：如出现 modulemap 死链，参考 KI-014 处理

## 6. patches 影响评估

| Patch | 评估 | 行动 |
|---|---|---|
| [`@react-native-community+masked-view+0.1.11.patch`](../../patches/@react-native-community+masked-view+0.1.11.patch) | 沿用 KI-002 状态；不动 | 重放验证 |
| [`react-native-htmlview+0.16.0.patch`](../../patches/react-native-htmlview+0.16.0.patch) | 沿用 KI-001 状态；不动 | 重放验证 |
| [`lottie-react-native+7.3.0.patch`](../../patches/lottie-react-native+7.3.0.patch) | KI-008 已修 `TextAttributeProps.UNSET` → `ReactConstants.UNSET`；0.87 内 Kotlin 2.1 K2 是否引入新的 UNSET 路径需实测 | 重放，若失败重新按 KI-008 手法修补 |
| [`react-native-spinkit-fix-new+1.1.4.patch`](../../patches/react-native-spinkit-fix-new+1.1.4.patch) | KI-019 / KI-022 双重坑历史；重放后 `grep '\.orig\|.transforms\|/build/'` 必须 0 | 重放 + grep 检查 |
| [`react-native-version-number-fix-new+0.3.6.patch`](../../patches/react-native-version-number-fix-new+0.3.6.patch) | 同上，且 namespace ↔ Java package 一致校验（KI-022 闸口） | 重放 + grep 检查 |

## 7. 风险与回滚
- **R1 · Node 22 主版本跳级**：DevEco 内嵌 Node 18 已经证明"项目级隔离方案"可行（[scripts/use-node.sh](../../scripts/use-node.sh)），22.13.0 走同一套 `n exec` 逻辑；CI 步骤 [.github/workflows/ci.yml](../../.github/workflows/ci.yml) 的 Node 版本需在阶段 5 前同步更新。
- **R2 · RN 0.86/0.87 ABI 静默 breaking**：0.85 升级时踩过 4 个（KI-008/009/010/011），本次已预升 reanimated/worklets/screens/gesture 到 0.87 生态版本收窄命中面，但仍需实机构建验证。
- **R3 · patches 5 个**：lottie/spinkit/version-number 历史四踩坑（KI-008/019/022），重放后必须走 §6 的 grep 闸口。
- **R4 · realm 20.2.0 在 0.87 下的表现**：realm 无更新，KI-016 修复思路（pure C++ TurboModule）与 0.87 应兼容，但仍需 iOS 装机实测。
- **R5 · master 直推**：用户放弃了 `feat/rn-0.87` 隔离分支；用 tag `pre-0.87-upgrade` / `rn-0.87-phase1..3` 分阶段兜底 revert。
- **回滚标准**：任一阶段卡点 > 2 个工作日 → `git revert` 该阶段的 commit + `git tag` 保留失败线索 + ADR-0005 状态改为 Superseded。

## 8. 验收标准
- [ ] `bash scripts/use-node.sh node --version` = `v22.13.0`
- [ ] `npm test` 通过（含现有 26 个单测）
- [ ] `npm run lint` 无新增 error
- [ ] `npm run bundle:android:smoke` / `bundle:ios:smoke` 双平台 bundle 出 4.5MB+
- [ ] Android `./gradlew clean assembleRelease` 成功，APK 装机 `pidof` alive 且 logcat `AndroidRuntime:E ReactNativeJS:E *:F` 空
- [ ] Android 全部 `.so` 16KB Align 校验（保持 KI-013 已修）
- [ ] iOS `xcodebuild Debug + Release` 成功，`simctl launch` 无 EXC_BAD_ACCESS
- [ ] `harness/testing/e2e/login.yaml` + `repository.yaml` 通过
- [ ] [手工回归](../testing/manual/) 全部 case 通过
- [ ] [CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md) 沉淀一条完整三段式复盘
- [ ] [ADR-0005](../decisions/0005-upgrade-rn-0-87.md) 状态改为 Accepted
- [ ] [README.md](../../README.md) 中版本号已更新到 0.87.1

## 9. 进度看板

| 阶段 | 状态 | 责任 | 备注 |
|---|---|---|---|
| 0. 准备 | 🟡 进行中 | AI | ADR + RFC 已出；`.nvmrc` 待改 |
| 1. JS 依赖升级 | ⬜ 待执行 | **人工执行 npm install** | 见 §4 命令清单 |
| 2. Android 原生 | ⬜ 待执行 | AI + 人工触发 gradle | 依赖阶段 1 完成 |
| 3. iOS 原生 | ⬜ 待执行 | AI + 人工触发 xcodebuild | 依赖阶段 1 完成 |
| 4. JS 兼容 | ⬜ 待执行 | AI | 与阶段 2/3 并行 |
| 5. 回归 | ⬜ 待执行 | 人工 + AI | 对照 [checklist.md](../regression/checklist.md) |
| 6. 发布文档 | ⬜ 待执行 | AI | CHANGELOG + README + ADR 状态迁移 |
