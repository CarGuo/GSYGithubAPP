# 关键数据流

## 1. 启动 / 登录

```
WelcomePage ──► 检查本地 Token (AsyncStorage)
   │
   ├── 无 Token ──► LoginPage ──► OAuth ──► userDao.loginIn ──► store.user.userInfo ──► MainTab
   └── 有 Token ──► userDao.refreshUserInfo ──► MainTab
```

- 登录态来源：[userDao.js](../../app/dao/userDao.js) 中的 `loginIn / loginOut / refreshUserInfo`。
- Token 存放：AsyncStorage（key 见 `app/style/constant.js`）。
- 401 拦截：[net/index.js](../../app/net/index.js) 全局 fetch 包装统一处理。

## 2. 列表分页（PullLoadMore 范式）

```
Page state.dataSource ◄── reducer ◄── action(thunk) ◄── dao.method(page)
                              ▲
                              │
                          fetch + Realm 缓存合并
```

- 通用列表组件：[PullLoadMoreListView.js](../../app/components/widget/PullLoadMoreListView.js)。
- 缓存优先策略（典型）：先读 Realm → 触发刷新 → 网络成功后回写 Realm + 更新 store。

## 3. Markdown / 代码渲染

```
仓库 README / Issue 内容 ──► htmlUtils.generateMd2Html ──► CustomWebComponent (WebView) ──► 主题渲染
```

- 关键文件：[htmlUtils.js](../../app/utils/htmlUtils.js)。
- 高亮：highlight.js + dracula 主题（CDN 注入）。
- 链接转换：自定义 scheme `gsygithub://` → 由 [htmlUtils.launchUrl](../../app/utils/htmlUtils.js#L350-L400) 解析跳转。

## 4. 通知与刷新桥
- 跨页通信：`actionUtils.getRefreshHandler()` 提供 publish/subscribe。
- 常用事件：`REFRESH_LANGUAGE`、`REFRESH_NOTIFY` 等，定义在 [constant.js](../../app/style/constant.js)。

## 5. 国际化
- 初始化：[i18n.js](../../app/style/i18n.js)。
- 切换语言：`changeLocale(language)` → 触发 `REFRESH_LANGUAGE` → `App.js` 重渲染整棵树。

## 6. 离线缓存
- Realm schema 见 [db/index.js](../../app/dao/db/index.js)。
- 已读历史 (ReadHistory)、仓库 Pulse、分支、commit、watcher、star、fork 全部支持离线读。
