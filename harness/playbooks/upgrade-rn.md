# SOP — React Native 升级（通用）

> 适用于任意小版本 / 中版本升级。大版本升级（如 0.80 → 0.85）需配合 [rn-0.85-upgrade-plan.md](./rn-0.85-upgrade-plan.md) 这类 RFC 一起执行。

## 总体阶段
1. **基线勘察**：固化当前版本号（RN / React / Hermes / 三方关键库）、构建情况、测试基线。
2. **RFC**：写一份 `rn-X.Y-upgrade-plan.md`，列依赖矩阵、风险点、原生改动、回滚预案。
3. **依赖与配置**：先升 JS 侧，跑 metro / lint / jest。所有目标版本满足 **发布 ≥ 15 天** 红线（见 [upgrade-dependency.md](./upgrade-dependency.md)）。
4. **原生 Android**：升 gradle wrapper / AGP / Kotlin / NDK / compileSdk；改 MainApplication / MainActivity 必要部分。
5. **原生 iOS**：升 Podfile（min_ios_version）、AppDelegate、use_frameworks 配置；`pod install`。
6. **JS API 兼容**：deprecated PropTypes、AppState、Linking、Image 等签名变化。
7. **三方库矩阵**：reanimated / screens / gesture-handler / navigation / realm / webview。
8. **patches 复核**：每个 patch 重新生成或弃用。
9. **回归**：跑 jest + RNTL + E2E + 手工 → 对照 [regression/checklist.md](../regression/checklist.md)。
10. **文档**：更新 ADR、CHANGELOG-AI、known-issues。

## 通用命令
```bash
# 评估升级 diff
npx @react-native-community/cli upgrade <target-version>
# 或使用 https://react-native-community.github.io/upgrade-helper/

# Pod 重置
cd ios && rm -rf Pods Podfile.lock build && pod install

# Gradle 清理
cd android && ./gradlew clean && cd ..
```

## 关键风险
- 新架构（Fabric / TurboModule）在 native 库版本不匹配时会"启动即崩"。
- Hermes 版本与 RN 强绑定，错版本会编译失败或运行 stack overflow。
- patches 包名 / 路径必须与升级后 node_modules 路径一致，否则 patch-package 静默失败。

## Tips
- 升级前先升 Node / Xcode / Android Studio 到推荐组合。
- 在干净分支推进，主干保持可发布。
- 每阶段都要能跑出"启动 + 登录 + 仓库详情"三件套，否则不进入下一阶段。
