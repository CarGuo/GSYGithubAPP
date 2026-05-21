# 架构总览

## 1. 分层

```
┌──────────────────────────────────────────────────┐
│  UI 层 (app/components/*, app/components/widget) │
├──────────────────────────────────────────────────┤
│  导航层 (app/navigation/AppNavigator.js)         │
├──────────────────────────────────────────────────┤
│  状态层 (app/store, redux + redux-thunk)         │
├──────────────────────────────────────────────────┤
│  数据层 (app/dao, app/net + Realm + AsyncStorage)│
├──────────────────────────────────────────────────┤
│  原生壳 (Android/iOS, Hermes + Fabric)           │
└──────────────────────────────────────────────────┘
```

- **UI 层**：函数式 + class 混用，common/ 通用组件、widget/ 业务组件、根目录是 Page。
- **导航层**：React Navigation v7（Stack + BottomTab + Drawer），保留 [Actions.js](../../app/navigation/Actions.js) 兼容旧 API。
- **状态层**：经典 Redux，按域拆 reducer，详见 [modules.md](./modules.md)。
- **数据层**：Realm（持久化缓存）+ HTTP（fetch 封装于 [net/index.js](../../app/net/index.js)）+ AsyncStorage（轻量配置）。
- **原生壳**：新架构开启（[gradle.properties](../../android/gradle.properties)），iOS 使用 RCTAppDelegate。

## 2. 关键三方依赖
| 依赖 | 作用 | 版本约束 | 风险 |
|---|---|---|---|
| react-native | 主框架 | 0.80.2（计划 0.85） | 升级影响最大 |
| @react-navigation/* | 路由 | v7 | RN 升级时需关注 reanimated/screens 版本对齐 |
| react-native-reanimated | 动画/手势 | 4.0.1 | 与 babel plugin、worklets 强耦合 |
| react-native-screens | 屏幕原生化 | 4.13.1 | 新架构兼容关键 |
| react-native-gesture-handler | 手势 | 2.27.2 | reanimated 4 需要 |
| realm | 本地数据库 | 20.1.0 | 有 patches；RN 升级需复核 |
| react-native-webview | WebView | 13.15 | 新架构兼容 |
| lottie-react-native | 动画 | 7.2.5 | 新架构兼容 |
| react-native-vector-icons | 图标 | 10.3.0 | autolink 注意 |
| react-native-image-crop-picker | 图片选择 | 0.41.2 | iOS Pod 兼容 |

## 3. 配置入口
- JS 入口：[index.js](../../index.js)
- App 根：[App.js](../../App.js)
- 路由：[AppNavigator.js](../../app/navigation/AppNavigator.js)
- Babel：[babel.config.js](../../babel.config.js)
- Metro：[metro.config.js](../../metro.config.js)
- ESLint：[.eslintrc.js](../../.eslintrc.js)
- Android：[android/build.gradle](../../android/build.gradle)、[android/app/build.gradle](../../android/app/build.gradle)、[android/gradle.properties](../../android/gradle.properties)
- iOS：[ios/Podfile](../../ios/Podfile)、[ios/GSYGithubApp/AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m)

## 4. 启动流程
1. `index.js` 注册组件 → `App.js` 读取语言偏好（[actionUtils.js](../../app/utils/actionUtils.js) 的 `getLanguageCurrent`）。
2. 渲染 `Provider` + `AppNavigator`。
3. `AppNavigator` 选择初始路由（Welcome / Login / Main）。
4. 进入业务页，触发 store 中的 thunk action → 调用 `app/net` → 返回数据写入 reducer / Realm。

## 5. 关键风险点
- 新架构（Fabric+TurboModule）已开，三方库一旦版本不对会白屏 / 崩溃。
- patches 三件套（[patches/](../../patches)）必须在升级时验证是否依然适用。
- Realm 的原生编译对 NDK / Kotlin 版本敏感。
- React Navigation v7 + reanimated 4 + screens 4 + gesture-handler 2 形成强耦合矩阵。
