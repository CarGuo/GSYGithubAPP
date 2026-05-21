# 模块清单

## app/components

| 路径 | 类型 | 说明 |
|---|---|---|
| [common/](../../app/components/common) | 通用组件 | Modal、Toast、列表通用项、Loading 等 |
| [widget/](../../app/components/widget) | 业务组件 | 用户卡片、仓库卡片、Issue 卡片、PullLoadMoreListView 等 |
| `*.js` | Page | Login/My/Person/Repository/Issue/Search 等屏幕级组件 |

> 维护原则：新增页面统一放根目录；可复用 UI 沉淀进 widget/；纯 UI 组件入 common/。

## app/store

- [store/index.js](../../app/store/index.js)：使用 `createStore + applyMiddleware(thunk)`。
- [reducers/](../../app/store/reducers)：按域拆分 (event/issue/login/repository/user)。
- [actions/](../../app/store/actions)：thunk action creators。
- [reducerUtils.js](../../app/store/reducerUtils.js)：`createReducer` 辅助。
- [type.js](../../app/store/type.js)：action type 常量。

## app/dao（数据访问 + 业务整合层）

| 文件 | 作用 |
|---|---|
| [db/index.js](../../app/dao/db/index.js) | Realm schema 定义（仓库 pulse、已读历史、分支、commit、watcher、star、fork…） |
| [eventDao.js](../../app/dao/eventDao.js) | 用户动态、关注动态 |
| [issueDao.js](../../app/dao/issueDao.js) | Issue / Notification |
| [repositoryDao.js](../../app/dao/repositoryDao.js) | 仓库详情、文件、分支、提交 |
| [userDao.js](../../app/dao/userDao.js) | 用户、登录、Token、关注关系 |

## app/net

- [net/index.js](../../app/net/index.js)：fetch 封装、统一鉴权 / 重试 / GraphQL 请求。
- [net/address.js](../../app/net/address.js)：API 地址常量。
- [net/qiniu/](../../app/net/qiniu)：图片上传 SDK。

## app/utils

| 文件 | 作用 |
|---|---|
| [actionUtils.js](../../app/utils/actionUtils.js) | 跨页交互工具：刷新桥接、分享、Right Btn 等 |
| [backUtils.js](../../app/utils/backUtils.js) | Android 返回键管理 |
| [eventUtils.js](../../app/utils/eventUtils.js) | 动态事件文案 |
| [filterUtils.js](../../app/utils/filterUtils.js) | 搜索过滤 |
| [htmlUtils.js](../../app/utils/htmlUtils.js) | Markdown / 代码 HTML 渲染 |
| [issueUtils.js](../../app/utils/issueUtils.js) | issue 工具 |
| [timeUtil.js](../../app/utils/timeUtil.js) | 时间转化 |
| [trending/](../../app/utils/trending) | Trending 抓取 |
| [pulse/](../../app/utils/pulse) | 仓库 Pulse 解析 |

## app/navigation

- [AppNavigator.js](../../app/navigation/AppNavigator.js)：Stack/Tab/Drawer 配置。
- [Actions.js](../../app/navigation/Actions.js)：兼容旧 router-flux API 的桥接层。
- [NavigationService.js](../../app/navigation/NavigationService.js)：脱离组件触发跳转。

## app/style
- [constant.js](../../app/style/constant.js)：颜色、尺寸、刷新事件常量。
- [i18n.js](../../app/style/i18n.js)：i18next 初始化。
- [index.js](../../app/style/index.js)：通用 StyleSheet。
- [lottie/](../../app/style/lottie)：动画资源。

## 原生
- Android：[MainActivity.java](../../android/app/src/main/java/com/gsygithubapp/MainActivity.java)、[MainApplication.java](../../android/app/src/main/java/com/gsygithubapp/MainApplication.java)。
- iOS：[AppDelegate.h](../../ios/GSYGithubApp/AppDelegate.h)、[AppDelegate.m](../../ios/GSYGithubApp/AppDelegate.m)、[Podfile](../../ios/Podfile)。
