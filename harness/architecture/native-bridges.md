# 原生壳与桥接

## Android

- 入口：[MainApplication.java](../../android/app/src/main/java/com/gsygithubapp/MainApplication.java)，使用 `DefaultReactNativeHost`，新架构通过 `getDefaultReactHost` + `HermesInstance` 接入。
- Application 中保留了 Flipper 反射初始化（DEBUG）。
- Gradle：
  - 根：[build.gradle](../../android/build.gradle) — kotlin 1.9.22、compileSdk 35、buildTools 35、NDK 26.1。
  - app：[app/build.gradle](../../android/app/build.gradle) — `apply plugin: com.facebook.react`、`autolinkLibrariesWithApp()`、JavaVersion 11。
  - wrapper：Gradle 8.11.1。
- vector-icons fonts：通过 `apply from: ../../node_modules/react-native-vector-icons/fonts.gradle` 注册。

## iOS

- 入口：[AppDelegate.h](../../ios/GSYGithubApp/AppDelegate.h) 继承 `RCTAppDelegate`。
- [AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m) 内：
  - 使用 `RCTAppDependencyProvider`（新架构推荐）。
  - 通过 `bundleURL` 区分 DEBUG / RELEASE。
- Podfile：使用 `use_react_native!`、`hermes_enabled => true`、`USE_FRAMEWORKS` 由环境变量控制。
- 隐私清单：[PrivacyInfo.xcprivacy](../../ios/GSYGithubApp/PrivacyInfo.xcprivacy)、[ios/PrivacyInfo.xcprivacy](../../ios/PrivacyInfo.xcprivacy)。
- Bridging Header：[GSYGithubApp-Bridging-Header.h](../../ios/GSYGithubApp-Bridging-Header.h)（保留以便后续 Swift 模块）。

## 原生依赖通过 autolink 接入
当前所有 native module 走 RN autolink，无手动 link 步骤。**新增** native module 时：
1. `npm i ...`，确认 `react-native.config.js`（无）或 autolink 默认行为。
2. iOS：`cd ios && pod install`。
3. Android：触发 gradle sync。
4. 在本表登记。

## patches 影响（[patches/](../../patches)）
| patch | 作用 | 升级 RN 时关注点 |
|---|---|---|
| `@react-native-community+masked-view+0.1.11.patch` | 兼容新架构 | 升级后检查模块是否仍存在；若已弃用，迁移到 `@react-native-masked-view/masked-view` |
| `react-native-htmlview+0.16.0.patch` | 修复废弃 PropTypes / View.propTypes | RN 0.85 已彻底移除 deprecated PropTypes，需复核 |
| `realm+20.1.0.patch` | 兼容新架构编译 | 升级 RN 时建议同步升级 realm 至最新稳定 |

## 原生改动门控
- 任何对 [MainApplication.java](../../android/app/src/main/java/com/gsygithubapp/MainApplication.java)、[AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m)、[Podfile](../../ios/Podfile)、[android/build.gradle](../../android/build.gradle) 的改动 **必须** 写 ADR 并更新 [playbooks/upgrade-rn.md](../playbooks/upgrade-rn.md) 中"已知改动点"。
- 升级 / 替换 patches 必须给出原因 + 回滚方案。
