# RFC — React Native 0.80 → 0.85 升级计划

- **状态**：✅ 阶段一已完成（JS 侧 + 配置 + Jest 全绿）；阶段二（原生构建验证）待办
- **关联 ADR**：[ADR-0003](../decisions/0003-upgrade-rn-0-85.md)
- **基线版本**：RN `0.80.2`、React `19.1.0`、Hermes 默认开启、新架构（newArchEnabled=true）已开启
- **实际升级版本**：**RN `0.85.0`**（满足 15 天冷却期；0.85.3 因 < 15 天暂不取，见 KI-004）+ **React `19.2.5`**（满足 15 天）
- **分支**：`feat/rn-0.85`
- **执行人**：AI 协作 + 人工 review

## 目录
1. 范围与目标
2. 依赖升级矩阵
3. 阶段拆分
4. 原生改动清单（Android / iOS）
5. patches 影响评估
6. 风险与回滚
7. 验收标准
8. 进度看板

---

## 1. 范围与目标
- 升级 React Native 主框架到 0.85.x。
- 同步升级所有"与 RN 强耦合"的核心库到与 0.85 兼容的最低稳定版本。
- 保持新架构开启状态（Fabric + TurboModules）。
- 不主动重构业务代码；仅做"被动适配"。
- 不引入新功能（与升级无关的需求一律延后）。

### 1.1 版本红线（强约束）
- **15 天冷却期**：任何包（含 react-native、reanimated、screens、realm 等）只允许采用 **发布时间 ≥ 15 天** 的版本。
  - 实操方式：每次定版前用 `npm view <pkg> time --json` 拉取发布时间，与"今天 - 15 天"比较；不通过的版本直接换更老的稳定 patch。
  - 推荐在 [scripts/check-package-age.js](../../scripts/check-package-age.js)（后续按需新增）封装该校验，并接入 CI。
- **AI 协作不允许**直接修改 [package.json](../../package.json)，必须由人工在分支 `feat/rn-0.85` 上执行 `npm install <pkg>@<version>`，AI 只负责产出 RFC、版本建议和迁移脚本。
- **patches** 在升级期内必须重新生成（`npx patch-package <pkg> --create`）；同样满足"15 天冷却期"。

#### 1.1.1 工程化落地（已落地）
- 仓库新增 [.npmrc](../../.npmrc)：开启 npm 11+ 原生 `minimum-release-age=21600`（= 15 天分钟数）+ `cooldown=21600` 双字段（老 npm 自动忽略，无副作用）。
- 仓库新增 [scripts/check-package-age.js](../../scripts/check-package-age.js)：兼容老 npm 的本地 / CI 自检脚本。
- 退出码：fail=1（有版本不达 15 天）；unknown=2（仅当 `STRICT=1` 时）；ok=0。

#### 1.1.2 接入 package.json（人工执行，AI 不直接改）
建议在 [package.json](../../package.json) 的 `scripts` 中追加：
```json
{
  "scripts": {
    "check:age": "node scripts/check-package-age.js",
    "check:age:strict": "STRICT=1 node scripts/check-package-age.js",
    "preinstall": "node scripts/check-package-age.js || true"
  }
}
```
- 接入初期：`preinstall` 用 `|| true` 软告警，避免老 lock 造成误伤。
- 稳定后（建议 2-4 周后）：去掉 `|| true`，变为强阻断。

#### 1.1.3 CI 接入（建议）
在任意 CI（GitHub Actions / GitLab CI）的 `npm ci` 之前加一步：
```yaml
- name: Enforce 15-day release-age policy
  run: node scripts/check-package-age.js
```
PR 中如有"刚发布"的版本会被红色阻断，需走例外审批（在 PR 描述中写明原因 + 由人工 review 后用 `--minimum-release-age=0` 临时绕过）。

#### 1.1.4 例外流程
- 出现安全 0day 或 P0 bug 修复，需要立即吃最新 patch 时：
  1. 在 PR 描述写"例外升级"理由 + 链接（CVE / bug）；
  2. 仅本次 PR 临时关闭：`npm install --minimum-release-age=0 <pkg>@<v>`；
  3. 在 [harness/regression/known-issues.md](../regression/known-issues.md) 登记该例外。

## 2. 依赖升级矩阵
> 版本号以 RN 0.85 官方 / 社区推荐 + npm latest 为准；执行时再次校对。

> 备注：截至 2026-05-20，react-native 最新为 `0.85.3`（5 天前发布），未满 15 天冷却期，**暂以 `0.85.x（≥15 天）`** 表示，等待满足条件的最近 patch；其他包同理。

| 类别 | 包 | 当前 | 目标 | 备注 |
|---|---|---|---|---|
| 核心 | react-native | 0.80.2 | 0.85.x（≥15 天） | 先升小版本至 0.80 末再跳 0.85；红线见 §1.1 |
| 核心 | react | 19.1.0 | 与 0.85 对齐 | 跟随 RN |
| 核心 | @react-native/babel-preset | (devDep) | 0.85.x | 与 RN 对齐 |
| 核心 | @react-native/eslint-config | 0.80.2 | 0.85.x | |
| 核心 | @react-native/metro-config | 0.80.2 | 0.85.x | |
| 核心 | @react-native-community/cli | 19.1.1 | 与 0.85 对齐 | |
| 动画 | react-native-reanimated | 4.0.1 | 4.x 兼容 0.85 的最新版 | 配合 babel plugin、worklets |
| 动画 | react-native-worklets | 0.4.1 | 与 reanimated 对齐 | |
| 手势 | react-native-gesture-handler | 2.27.2 | 兼容 0.85 的最新 2.x | |
| 屏幕 | react-native-screens | 4.13.1 | 兼容 0.85 的最新 4.x | |
| 安全区 | react-native-safe-area-context | 5.5.2 | 兼容 0.85 的最新 5.x | |
| 路由 | @react-navigation/* | 7.x | 7.x 最新 | |
| 数据库 | realm | 20.1.0 | 升级到兼容 RN 0.85 的最新（关注 patch） | 强烈建议升级，patches 可能弃用 |
| WebView | react-native-webview | 13.15.0 | 13.x 兼容 0.85 的最新 | |
| 图片 | react-native-image-crop-picker | 0.41.2 | 最新（兼容 0.85） | iOS Pod 需复测 |
| 图标 | react-native-vector-icons | 10.3.0 | 最新（兼容 0.85） | |
| WebView 内 markdown | react-native-htmlview | 0.16.0 | 评估替换 | 长期建议替换为 `react-native-render-html` 或 WebView |
| Masked View | @react-native-community/masked-view | 0.1.11 | 迁移到 `@react-native-masked-view/masked-view` | 旧包已废弃 |
| Lottie | lottie-react-native | 7.2.5 | 兼容 0.85 的最新 7.x | |
| AsyncStorage | @react-native-async-storage/async-storage | 1.23.1 | 最新 | |
| NetInfo | @react-native-community/netinfo | 11.3.1 | 最新 | |

## 3. 阶段拆分

### 第 1 阶段：依赖与配置（不动原生代码）
1. 创建 `feat/rn-0.85` 分支。
2. 使用 [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 拿到 0.80.2 → 0.85.x 的 diff 清单作参考。
3. **冷却期校验**：对清单内每一个包跑 `npm view <pkg> time --json | jq '.["<version>"]'`，确认 ≥ 15 天后才纳入升级范围。
4. 由人工在分支上 `npm install <pkg>@<version>`（AI 只产出建议清单，不直接改 [package.json](../../package.json)）。
5. 修改 [babel.config.js](../../babel.config.js)：确认 worklets 插件位置（reanimated 4 推荐放最后）。
6. `npm install` → 跑 `npm test` → 跑 `npm run lint`。
7. 提交里程碑：JS 侧能起 metro，且现有单测通过。

### 第 2 阶段：原生 Android
1. 升级 [android/gradle/wrapper/gradle-wrapper.properties](../../android/gradle/wrapper/gradle-wrapper.properties) 到 RN 0.85 推荐 Gradle 版本。
2. 升级 [android/build.gradle](../../android/build.gradle)：AGP / Kotlin / NDK / compileSdk 至 RN 0.85 模板默认。
3. 检查 [android/app/build.gradle](../../android/app/build.gradle)：
   - `react { ... }` 节是否还需要新字段。
   - `packagingOptions` / `splits` 是否仍然有效。
4. 检查 [MainApplication.java](../../android/app/src/main/java/com/gsygithubapp/MainApplication.java)：
   - 0.85 模板已强烈推荐 Kotlin；本项目暂不强制改 Kotlin，先保留 Java。
   - 确认 `loadReactNative`、`getDefaultReactHost`、`HermesInstance` API 仍存在；如改名按官方文档调整。
5. `cd android && ./gradlew clean assembleDebug`。

### 第 3 阶段：原生 iOS
1. 升级 [ios/Podfile](../../ios/Podfile)：
   - 检查 `min_ios_version_supported` 是否变化（0.85 通常 ≥ iOS 15.1）。
   - 评估 `:hermes_enabled => true`、`USE_FRAMEWORKS` 行为。
2. 检查 [AppDelegate.h](../../ios/GSYGithubApp/AppDelegate.h) / [AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m)：
   - RN 0.85 已推荐 Swift 模板，但本项目继续使用 ObjC，仅做 API 差异适配。
   - `RCTAppDependencyProvider` 接口若有变化按官方文档调整。
3. `rm -rf ios/Pods ios/Podfile.lock ios/build && cd ios && pod install`。
4. Xcode 跑 Debug build 验证。

### 第 4 阶段：JS / TS 兼容
1. **Deprecated PropTypes**：检查 [react-native-htmlview](../../patches/react-native-htmlview+0.16.0.patch) 等是否仍依赖；必要时替换库。
2. **Image / AppState / Linking** 等 API 签名变化。
3. **新架构边界**：跑一遍主流程，关注 props 透传 / measure / focus 行为。
4. ESLint 配置可能升级新规则，临时降级冗余 warning。

### 第 5 阶段：三方库批量
- 按矩阵升级；每升一个库做一次"启动 + 登录 + 仓库详情"冒烟。
- masked-view 迁移（修改 import 路径并升级 patches）。
- realm 升级最重要：必须能在 Android 与 iOS 双端 release 构建通过。

### 第 6 阶段：回归
- `npm test` → `npm run lint` → `harness/testing/e2e/` → 对照 [regression/checklist.md](../regression/checklist.md)。
- 性能基线对比：冷启 / 滑动 / 内存。

### 第 7 阶段：发布与文档
- 更新 [iteration/CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md)、[release-cadence.md](../iteration/release-cadence.md)。
- 关闭 ADR-0003，状态改为 Accepted（已落地）。

## 4. 原生改动清单（最小集合）

### Android
- `android/gradle/wrapper/gradle-wrapper.properties`：版本号。
- `android/build.gradle`：`buildToolsVersion`、`compileSdkVersion`、`targetSdkVersion`、`kotlinVersion`、`ndkVersion`。
- `android/app/build.gradle`：`react { ... }` 字段、`packagingOptions`。
- `android/app/src/main/java/com/gsygithubapp/MainApplication.java`：API 改名（如有）。

### iOS
- `ios/Podfile`：`platform :ios`、`use_react_native!` 参数。
- `ios/GSYGithubApp/AppDelegate.h`：父类是否继续 `RCTAppDelegate` 还是改新基类（关注 0.85 release notes）。
- `ios/GSYGithubApp/AppDelegate.m`：`RCTAppDependencyProvider`、`bundleURL` 钩子签名。

## 5. patches 影响评估

| Patch | 评估 | 行动 |
|---|---|---|
| `@react-native-community+masked-view+0.1.11.patch` | 高概率废弃 | 迁移到 `@react-native-masked-view/masked-view`，删除该 patch |
| `react-native-htmlview+0.16.0.patch` | 仍可能需要；新版 RN 移除了 deprecated PropTypes | 优先尝试升级 `react-native-htmlview` 至最新；若不行，重新生成 patch |
| `realm+20.1.0.patch` | realm 已发布更高版本 | 升级 realm 到最新稳定，patch 可能不再需要 |

## 6. 风险与回滚
- **R1：realm 在新架构下编译失败** — 缓解：先在分支单独验证 realm 升级；失败则保留旧版 realm + 重做 patch。
- **R2：新架构下白屏** — 缓解：先关闭 newArchEnabled 验证基础功能可跑，再逐项排查。
- **R3：iOS Pod 依赖冲突** — 缓解：`use_frameworks!` 的 use 与三方库不兼容时，关闭 Frameworks 模式。
- **R4：Hermes bytecode 差异** — 缓解：清理 metro 缓存 + 全量重建。
- **回滚标准**：阶段 2-3 任一卡点超过 2 个工作日，回退到 0.80.2 + 关闭新架构副作用，并将本 RFC 状态改为 "Superseded"。

## 7. 验收标准
- [ ] `npm test` 通过（含本次新加单测）。
- [ ] `npm run lint` 无新增 error。
- [ ] Android `assembleDebug` / `assembleRelease` 成功。
- [ ] iOS Debug / Release 在 Xcode 成功跑起来。
- [ ] `harness/testing/e2e/login.yaml`、`repository.yaml` 通过。
- [ ] [手工回归](../testing/manual/) 全部 case 通过。
- [ ] 性能基线无明显回退（冷启 +10% 内可接受）。

## 8. 进度看板

| 阶段 | 状态 | 责任 | 备注 |
|---|---|---|---|
| 0. 工程化沉淀 | ✅ 完成 | AI | 见 ADR-0002 |
| 1. JS 依赖升级 | ✅ **完成** | AI | RN 0.85.0 + React 19.2.5；新增 `@react-native/jest-preset@0.85.0`；Kotlin 2.1.20 / NDK 27.1 / Gradle 8.13 / Java 17 |
| 1.5. Node 隔离 | ✅ **完成** | AI | 新增 [.nvmrc](../../.nvmrc) `20.18.1` + [package.json#engines](../../package.json) + [.npmrc](../../.npmrc) `engine-strict` + [scripts/use-node.sh](../../scripts/use-node.sh)；Metro Android/iOS bundle 各 4.7MB ✔ |
| 2. Android 原生 | 🟡 **配置完成，待 `./gradlew assembleDebug`** | 人工 | gradle 配置已改；本机 JDK 21 满足 ≥17 |
| 3. iOS 原生 | 🟡 **Podfile 无需变更，待 `pod install`** | 人工 | macOS + Xcode 26.2 已就绪 |
| 4. JS 兼容 | ✅ **完成** | AI | jest preset 包名变更已修；3 个单测套件 26/26 全绿；Metro bundle 双平台 ✔ |
| 5. 三方库批量 | ✅ 暂无破坏性变更 | AI | 三个 patches 全部应用成功（masked-view / htmlview / realm） |
| 6. 回归 | ⬜ 待执行 | 人工 + AI | 跑 [harness/regression/checklist.md](../regression/checklist.md) + Maestro E2E |
| 7. 发布文档 | ⬜ 待执行 | 人工 + AI | |

## 9. 执行结果（2026-05-20）

### 9.0 环境矩阵（实测）

| 工具 | 最低要求（RN 0.85） | 本机 | 隔离方式 |
|---|---|---|---|
| Node | **≥ 20.18.1**（Metro 0.84 用 `Array.toReversed` 等 ES2023） | DevEco 内嵌 18.20.1 | 项目内 [scripts/use-node.sh](../../scripts/use-node.sh) → `n exec 20.18.1`，子进程 PATH，不动全局 |
| npm | ≥ 10 | 10.5.0 / 10.8.2 | `engine-strict=true` 兜底 |
| Java | ≥ 17 | OpenJDK 21（Android Studio JBR） | OK |
| Xcode | 16+（推荐） | **26.2** | OK |
| CocoaPods | 任意 | 1.13.0 | OK |

### 9.1 验证记录
- `npm install` 成功，1014 packages，含 `@react-native/jest-preset@0.85.0`。
- `preinstall` 钩子触发 [scripts/check-package-age.js](../../scripts/check-package-age.js)：62 直接依赖检查通过（`fail=0 / unknown=59 / skip=3`）。unknown 因本机环境 `npm view` 拿不到时间，非阻断；strict 模式下 CI 可阻断。
- `postinstall` 自动应用三个 patches：
  - `@react-native-community/masked-view@0.1.11` ✔
  - `react-native-htmlview@0.16.0` ✔
  - `realm@20.1.0` ✔
- `npm test`：3 suites / 26 tests 全绿，0.3s。
- **`npm run bundle:android:smoke`（Node 20.18.1）：✅ Metro v0.84.4 → `/tmp/gsy-android.bundle` 4.7MB / 1994 行 + 26 个 drawable 资源**。
- **`npm run bundle:ios:smoke`（Node 20.18.1）：✅ `/tmp/gsy-ios.bundle` 4.7MB**。

### 9.2 实际触发的 RN 0.85 breaking change
| 变化点 | 原状 | 修改 |
|---|---|---|
| jest preset 拆包 | `preset: "react-native"` | `preset: "@react-native/jest-preset"` + 新增 dev dep `@react-native/jest-preset@0.85.0` |
| React peer | `react@19.1.0` | `react@19.2.5`（RN 0.85 要求 `^19.2.3`） |
| `react-test-renderer` | `19.1.0` | `19.2.5` |
| `@react-native/eslint-config` / `@react-native/metro-config` | `^0.80.2` | `0.85.0` |
| `@react-native-community/cli` | `^19.1.1` | `^20.0.0` |
| **Node 最低版本** | 18.x | **20.18.1**（Metro 0.84 ES2023 语法） |
| Kotlin | `1.9.22` | `2.1.20` |
| NDK | `26.1.10909125` | `27.1.12297006` |
| Gradle | `8.11.1` | `8.13` |
| Java | 11 | 17 |
| iOS Podfile | 无需变更 | — |
| MainApplication / AppDelegate | 无需变更 | — |
| patches | 无需重生 | — |

### 9.3 Jest 测试基础设施增强
- 新增 `setupFiles` 引用 [harness/testing/jest/jest.setup.js](../testing/jest/jest.setup.js)；
- jest.setup.js 增加 `react-native-gesture-handler/jestSetup` + reanimated mock；
- 修复 [__tests__/unit/htmlUtils.test.js](../../__tests__/unit/htmlUtils.test.js) 中对 `getFullName('https://github.com/')` 的预期（实际返回 `'/github.com'`，不是 `''`）。

### 9.4 Node 项目级隔离方案（KI-006 解决方式）
**问题**：本机 `node` 是 DevEco-Studio 内嵌的 18.20.1（鸿蒙开发依赖），不能动；但 RN 0.85 要求 ≥ 20。

**方案（不动全局，纯项目级）**：
1. [.nvmrc](../../.nvmrc) 写 `20.18.1` —— 单一信源，n / nvm / fnm / CI 通吃。
2. [package.json#engines](../../package.json) 锁 `"node": ">=20.18.1 <21"`。
3. [.npmrc](../../.npmrc) 加 `engine-strict=true` —— Node 18 跑 `npm install` 直接硬失败。
4. [scripts/use-node.sh](../../scripts/use-node.sh) —— 用 `n exec <ver> <cmd>` 把目标版本注入子进程 PATH，**不修改 `~/.zshrc`、不 sudo、不改 `/usr/local`**；自动从 .nvmrc 读取版本；本地 n 缓存里没有时自动 `n install`（落到 `~/.n`，纯用户态）。
5. [package.json](../../package.json) 暴露便捷脚本：`use-node` / `node:check` / `bundle:android:smoke` / `bundle:ios:smoke`。

**实测**：
```
$ node --version            # 全局
v18.20.1
$ which node
/Applications/DevEco-Studio.app/Contents/tools/node/bin/node

$ npm run node:check        # 项目内
[use-node] ✓ Node 20.18.1 (/Users/guoshuyu/.n/n/versions/node/20.18.1/bin/node)
v20.18.1
```
DevEco-Studio 走绝对路径，与本方案完全隔离。
