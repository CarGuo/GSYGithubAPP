# Release-gate Checklist

> 任何发版（grayscale / store）前必须从头跑一遍。

## 0. 准备
- [ ] 已在主干同步最新代码、安装最新依赖（`npm ci`）。
- [ ] `app/config/ignoreConfig.js` 已正确放置。
- [ ] iOS 已 `pod install`；Android 已 gradle sync 成功。

## 1. 静态检查
- [ ] `npm run lint` 通过（无 error，warning 在记录里）。
- [ ] 无新增 TODO/FIXME；如有，已写入 [known-issues.md](./known-issues.md)。

## 2. 单元 / 组件测试
- [ ] `npm test` 全部通过。
- [ ] 新增功能至少有一条单测 / 组件测试（参见 [harness/testing/strategy.md](../testing/strategy.md)）。
- [ ] 快照变更已 review。

## 3. E2E
- [ ] `harness/testing/e2e/login.yaml` 通过。
- [ ] `harness/testing/e2e/repository.yaml` 通过。
- [ ] 其他 E2E 用例：________

## 4. 手工回归
- [ ] [auth.md](../testing/manual/auth.md) 全部通过
- [ ] [dynamic.md](../testing/manual/dynamic.md) 全部通过
- [ ] [trending.md](../testing/manual/trending.md) 全部通过
- [ ] [repository.md](../testing/manual/repository.md) 全部通过
- [ ] [search.md](../testing/manual/search.md) 全部通过
- [ ] [profile.md](../testing/manual/profile.md) 全部通过
- [ ] [infra.md](../testing/manual/infra.md) 全部通过

## 5. 性能 / 内存
- [ ] 冷启动 < 2.5s（Android 中端机 + iOS A12 以上）。
- [ ] 列表滑动无明显丢帧。
- [ ] 内存峰值 < 350MB。

## 6. 兼容性
- [ ] Android 7-14 至少抽 3 个版本验证。
- [ ] iOS 14、16、17 各验证 1 次。
- [ ] 平板尺寸抽样验证。

## 7. 包大小 / 隐私
- [ ] release apk 包大小未异常增长（>10% 需说明）。
- [ ] iOS 隐私清单（[PrivacyInfo.xcprivacy](../../ios/GSYGithubApp/PrivacyInfo.xcprivacy)）与三方 SDK 一致。

## 8. Release 包必跑（强制 / 打 tag 前最后一道闸）
> ⚠️ **任何打 git tag 触发 CI 发版的动作之前，本节必须人工逐项确认通过。这是 v5.0.0 复盘后立的硬规矩 —— bundleRelease（AAB）不会跑 verifyReleaseResources，patch 损坏 / 资源链接失败会被静默吞掉，只有走完整 assembleRelease 才会暴露**。

### 8.1 Patch 体检（防 patch-package 静默失效）
- [ ] `grep -l '\.orig' patches/*.patch` → 0 命中（patch 头部 `--- a/x b/x`，不能是 `--- a/x.orig b/x`）。
- [ ] `grep -l '\.transforms\|/build/' patches/*.patch` → 0 命中（patch 不允许包含 `node_modules/<pkg>/android/build/.transforms/`、`bundleLib*Dex/`、`*.dex`、`*.jar` 等 Gradle 中间产物，否则 CI 干净环境 patch-package apply 会失败）。重新生成 patch 前必须 `rm -rf node_modules/<pkg>/android/build` 清掉构建产物。
- [ ] 任何 patch 单文件 ≤ 50KB；超过必须人工 review 是否混入构建产物。
- [ ] `bash scripts/use-node.sh npx patch-package` 重跑时无 `patch ... did not apply` 警告。
- [ ] [package.json](../../package.json) 任何 `dependencies` 改动后，必须 `rm -rf node_modules && npm install` 跑一遍 patch-package 全量 apply 流程。
- [ ] 必跑一次 **从零模拟 CI**：`rm -rf node_modules && bash scripts/use-node.sh npm install` 全新装机后 patch-package 全 ✔，再跑一次 §8.2 装机闭环（避免 "本地缓存通过 / CI 失败" 假象）。

### 8.2 Android Release 装机闭环（必跑）
- [ ] `cd android && bash ../scripts/use-node.sh ./gradlew clean assembleRelease` → BUILD SUCCESSFUL（不能用 `bundleRelease` / `build-android --mode=release` 替代，二者跳过 verifyReleaseResources）。
- [ ] [android/app/build/outputs/apk/release/app-release.apk](../../android/app/build/outputs/apk/release/app-release.apk) 存在；`aapt2 dump badging` 验证 `versionCode` / `versionName` 与 [android/app/build.gradle](../../android/app/build.gradle) 期望一致。
- [ ] `adb uninstall com.gsygithubapp` → `adb install -r .../app-release.apk` → `adb shell am start -n com.gsygithubapp/.MainActivity`。
- [ ] 启动后 5 秒内 `adb shell pidof com.gsygithubapp` 仍非空（不是闪退）。
- [ ] `adb logcat -d 'AndroidRuntime:E ReactNativeJS:E *:F'` 输出为空（无 fatal、无 RN 红屏）。
- [ ] 关键页面手测：登录页 → OAuth/Token 任一 → 首页 → Trending → 详情 → 关于页"检查更新"跳转浏览器到 GitHub releases。
- [ ] 截屏归档到 `/tmp/gsy_release_<page>.png` 至少 3 张（登录 / 首页 / 关于）。

### 8.3 混淆 / R8 场景（**当前关闭，未来打开时必跑**）
> 当前 [android/app/build.gradle](../../android/app/build.gradle#L67) `enableProguardInReleaseBuilds = false`、[L132](../../android/app/build.gradle#L132) `minifyEnabled false`，所以 R8/ProGuard 路径未启用。
> 一旦把 `enableProguardInReleaseBuilds = true` 或 `minifyEnabled true` 切回开启（典型场景：上架/瘦包），本节强制必跑：
- [ ] [android/app/proguard-rules.pro](../../android/app/proguard-rules.pro) 中保留所有桥接类 `keep` 规则：`com.facebook.react.**`、`com.facebook.hermes.**`、所有 `*ReactPackage`、`*Module`、`*ViewManager`、Realm 模型类（[app/dao/db/](../../app/dao/db/)）、JSI 注入入口（[com.RNFetchBlob](../../node_modules/rn-fetch-blob)、[react-native-spinkit-fix-new](../../node_modules/react-native-spinkit-fix-new)、[react-native-version-number-fix-new](../../node_modules/react-native-version-number-fix-new)、Realm `binding.js` 触达的 native ）。
- [ ] `assembleRelease` 通过的同时，confirm `app/build/outputs/mapping/release/mapping.txt` 已产出，留底用于 stack trace 解码。
- [ ] **必跑**：装机后跑完上面 §8.2 全部场景。R8 失败的典型表现：
  - `ClassNotFoundException` 启动闪退 → 缺 `keep`
  - `ReactNoCrashSoftException: ViewManager XX not found` → 缺 ViewManager keep
  - JSI 模块 `nullptr` 段错（Realm/Reanimated/Worklets）→ 缺 native binding keep
  - 反射 / Gson / Moshi 字段错乱 → 缺 `@Keep` / model keep
- [ ] 任何 R8 报错必须用 `mapping.txt` 还原栈帧后再修，不允许通过 `--no-minify` 绕过。

### 8.4 iOS Release 装机闭环（如本轮发版包含 iOS）
- [ ] `xcodebuild -workspace ios/GSYGithubApp.xcworkspace -scheme GSYGithubApp -configuration Release -sdk iphonesimulator` BUILD SUCCEEDED。
- [ ] `xcrun simctl install` + `simctl launch` 启动后 30s 不闪退；Console.app 无 `EXC_BAD_ACCESS` / `SIGSEGV`。
- [ ] 关键页面手测同 §8.2。
- [ ] 真机 ipa（如启用 bitcode/symbolicate）需 archive 出 dSYM 留底。

### 8.5 CI 远端构建匹配
- [ ] 本地 §8.2 通过后 push tag。打 tag 前 grep 一次 [.github/workflows/ci.yml](../../.github/workflows/ci.yml)，确认 `Generate APK` job 命令与本地一致或更严格（不弱于 assembleRelease）。
- [ ] 远端 [actions/runs](https://github.com/CarGuo/GSYGithubAPP/actions) 触发后必须 watch 到 `Release APK` job 全部 success；APK 资产挂到 release 页面后再宣布发版。

## 9. 文档与日志
- [ ] [harness/iteration/CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md) 追加了本次条目。
- [ ] 必要时新增 ADR。
- [ ] [harness/regression/known-issues.md](./known-issues.md) 已同步。
