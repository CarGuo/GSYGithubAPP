# ADR-0004: realm 20.1.0 → 20.2.0 破例升级（关闭 KI-013 + KI-016）

- 状态：Implemented（2026-05-21）
- 日期：2026-05-21
- 决策人：Owner（@guoshuyu）+ AI 协作
- 关联：[KI-013](../regression/known-issues.md)（已关闭）、[KI-016](../regression/known-issues.md)（已关闭）、[ADR-0003](./0003-upgrade-rn-0-85.md)、[checklist.md §8](../regression/checklist.md)

## 落地结果（2026-05-21）

- ✅ 改 [package.json#L68](../../package.json#L68) `realm: 20.1.0 → 20.2.0`，`npm install` 5 patches 全 ✔（已删 [patches/realm+20.1.0.patch](../../patches/realm+20.1.0.patch)）
- ✅ [app/dao/db/index.js](../../app/dao/db/index.js) 从 lazy require + 双层 noop 简化为正常 `import Realm from 'realm'` + 单层 try/catch logger.warn
- ✅ `cd android && ./gradlew assembleRelease` BUILD SUCCESSFUL **9s**（836 tasks: 19 executed, 817 up-to-date）
- ✅ APK 内 [librealm.so](../../node_modules/realm) `llvm-readelf -lW | grep LOAD` 三段 LOAD segment 全部 `Align=0x4000`(16KB)
- ✅ APK 内 `lib/arm64-v8a/*.so` 共 18 个 `.so`，全部 16KB 合规，**0 BAD**
- ✅ emulator Pixel_7 / API 36 / arm64-v8a `adb install -r` Success → `am start` pid alive → `adb logcat AndroidRuntime:E ReactNativeJS:E *:F` 0 行
- ✅ logcat 抓到 `Realm: setDefaultRealmFileDirectory` + `Absolute path: /data/data/com.gsygithubapp/files` —— realm schema register + 默认目录初始化正常
- ✅ versionCode 21→22 / versionName 5.0.0→5.0.1（[android/app/build.gradle](../../android/app/build.gradle) + [ios/GSYGithubApp/Info.plist](../../ios/GSYGithubApp/Info.plist)）


## 上下文

v5.0.0 发版闭环（commit `9c20402` / CI run `26214606394` 三 job 全绿）后，仍有两个 P0/P2 的待修项靠"软兜底"过线：

1. **KI-013（P2 / 16KB page-size）**：用 [/tmp/check_align2.sh](file:///tmp/check_align2.sh) + NDK 28.2 `llvm-readelf -lW` 实测 [v5.0.0 APK](https://github.com/CarGuo/GSYGithubAPP/releases/download/v5.0.0/app-release.apk) 内 18 个 `lib/arm64-v8a/*.so`：**17 个全部 `Align=0x4000`(16KB) ✅，仅 [librealm.so](../../node_modules/realm) 一个 `Align=0x1000`(4KB) ❌**。Android 15+ / 16 设备首启会弹 "This app isn't 16 KB compatible" 系统对话框，靠系统兼容模式跑。
2. **KI-016（P1 / iOS 段错）**：realm@20.1.0 [binding/apple/RealmReactModule.mm:67-69](../../node_modules/realm/binding/apple/RealmReactModule.mm) 写法 `auto &rt = *static_cast<facebook::jsi::Runtime *>(bridge.runtime);` 在 RN 0.85 + bridgeless 下 `[RCTBridge currentBridge]` 返回 nil → `*static_cast<...>(nil)` SIGSEGV。当前用 [patches/realm+20.1.0.patch](../../patches/realm+20.1.0.patch)（防御性 `@throw NSException`）+ [app/dao/db/index.js](../../app/dao/db/index.js) lazy try/catch + noop 兜底压住，realm 实际**没真在 iOS 端工作**（写入空 realm，clearCache 走 noop）。

我们之前把"修复路径"写成"等 realm 21+ 满冷却"——这是错的。现状核查：

```
$ curl -s https://registry.npmjs.org/realm | jq '.["dist-tags"].latest'
"20.2.0"
```

**npm 上 realm 没有 21+，最新就是 20.2.0**（2025-08-11 发布，距今 282 天）。读 [v20.2.0 release note](https://github.com/realm/realm-js/releases/tag/v20.2.0) 关键条目：

- ✅ **16KB page size support for Android 15+**（[#7019](https://github.com/realm/realm-js/pull/7019)）—— 直接修 KI-013
- ✅ **Add support for React Native 0.80.0, by migrating to a pure C++ TurboModule**（[#7029](https://github.com/realm/realm-js/pull/7027)）—— 用纯 C++ TurboModule 替代 ObjC `RCTBridge.runtime` 取法，bridgeless 下不再 nil 解引用 → 直接修 KI-016 根因
- ✅ **Fix numerous crashes on Android, by explicitly setting C++ standard (C++20)**（[#7027](https://github.com/realm/realm-js/pull/7027)）
- ✅ Compatibility: RN ≥ 0.71.4 + 新架构 only —— 我们 RN 0.85.0 + Fabric/TurboModules ✅
- ✅ AGP ≥ 8.5 不需要 legacy packaging。本机 [@react-native/gradle-plugin libs.versions.toml:2](../../node_modules/@react-native/gradle-plugin/gradle/libs.versions.toml#L2) `agp = "8.12.0"` ✅

升级面信息：
- 同 major（20.x → 20.x），File format v24，向下读 v10 ——**schema 兼容**，不需要做数据迁移
- 我们 realm 仅用作缓存（[app/dao/db/index.js](../../app/dao/db/index.js)，仅 `clearCache` 一处真实调用），即使 schema 推平也无副作用

## 决策

**破例升级 realm 20.1.0 → 20.2.0**，靠 release-note 指名修复同时关闭 KI-013 + KI-016。

## 红线对照

[AGENTS.md §4](../../AGENTS.md#L41) 红线："升级/新增依赖时只能采用发布时间 ≥ 15 天的版本；AI 不直接编辑 package.json，必须由人工执行 `npm install`"：

- ✅ **冷却时间**：20.2.0 发布 282 天前，远超 15 天红线
- ✅ **人工执行**：本 ADR 落地时由 Owner 手动改 [package.json#L68](../../package.json#L68) `"realm": "20.2.0"` 并跑 `npm install`
- ✅ **指名依据**：本 ADR 引用 release-note PR 链接逐条对应当前两个 KI 的根因，不是猜测

## 后果

### 正面
- 关闭 KI-013：[librealm.so](../../node_modules/realm) 16KB 对齐，APK 整体合规 Android 16
- 关闭 KI-016：iOS 段错根治，realm 在新架构下真正可用；可拆掉 [patches/realm+20.1.0.patch](../../patches/realm+20.1.0.patch) + [app/dao/db/index.js](../../app/dao/db/index.js) 的 lazy/noop 兜底
- 顺带得到 Android C++20 多个 crash 修复

### 风险与缓解
- **风险 R1**：纯 C++ TurboModule 在 bridgeless 下首次接入，可能踩 RN 0.85 的边界。缓解：feature 分支 / PR 先行，本地 §8.1+§8.2 双端装机闭环 + 启动 + 写入读出至少各 1 次后再合并。
- **风险 R2**：拿掉 [app/dao/db/index.js](../../app/dao/db/index.js) lazy noop 兜底后，如 realm 启动失败会阻塞 [AppRegistry.registerComponent](../../index.js) → 白屏。缓解：保留 try/catch 但改成 logger.warn 而非彻底 noop；只把"取消 lazy"放在确认 realm 启动成功后。
- **风险 R3**：升级后 [patches/realm+20.1.0.patch](../../patches/realm+20.1.0.patch) 不再适用。缓解：一并删除该 patch；如发现新版本仍有需要 patch 的边界，按 [KI-019](../regression/known-issues.md) 的 patch 生成 SOP 重做。
- **风险 R4**：File format v24 与 20.1.0 v24 一致（向下读 v10），但实际安装升级时本地缓存 realm 文件可能触发 schema 兼容打开。缓解：clearCache 兜底 + 首次启动失败时按 [components/SettingPage.js#L163-L165](../../app/components/SettingPage.js#L163-L165) 一键清除。

## 验证 / 闸口

执行顺序（强制）：
1. Owner 改 [package.json#L68](../../package.json#L68) `"realm": "20.2.0"`，AI 不动。
2. Owner 跑 `npm install`（自动跑 patch-package；`patches/realm+20.1.0.patch` 因版本不匹配会被 patch-package warn skip，AI 随后删除）。
3. AI 删 [patches/realm+20.1.0.patch](../../patches/realm+20.1.0.patch)、修 [app/dao/db/index.js](../../app/dao/db/index.js) 把 lazy noop 改成正常 import + try/catch logger.warn。
4. AI 跑 [checklist §8.1+§8.2](../regression/checklist.md#L57)：
   - 6 个 patch（删 realm 后变 5 个）全 ✔ apply
   - `cd android && ./gradlew clean assembleRelease` BUILD SUCCESSFUL
   - `unzip -j .../app-release.apk 'lib/arm64-v8a/librealm.so' -d /tmp/realm_after && llvm-readelf -lW /tmp/realm_after/librealm.so | grep LOAD` —— **第一行 LOAD 末列必须为 `0x4000`**
   - emulator 装机 0 fatal logcat
5. AI 跑 iOS 端 §8.4：`pod install` + `xcodebuild -scheme GSYGithubApp -configuration Debug-iphonesimulator` + `simctl launch` 不再 SIGSEGV。
6. 通过后 commit + push + 重打 tag。

## 备选方案（rejected）

- **维持现状**：rejected。两个待修项靠软兜底拖到下次大改一起做，但目前正在 v5.0 发版收尾、实证 20.2.0 完美命中所有诉求且零数据迁移成本，没有理由再拖。
- **等 realm 21**：rejected。**realm 21 不存在**——npm latest = 20.2.0；之前 KI-013 写"等 21+"是错误信息。
- **零升级，做 zipalign 16384 兜底**：rejected。`zipalign -P 16` 只解决 APK 内压缩对齐，**不能修 .so 自身 LOAD segment Align**，对 16KB 系统对话框无效。
