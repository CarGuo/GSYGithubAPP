# 需求 — 基础设施

## 域

### 1. 国际化 (i18n)
- 入口：[i18n.js](../../app/style/i18n.js)，使用 `i18next + react-i18next + react-native-localize`。
- 关键 API：`I18n('key')`（默认导出）、`changeLocale(language)`。
- 验收：切换语言后立即在所有 Page 生效，App 通过 `REFRESH_LANGUAGE` 重新挂载。

### 2. 主题 / 样式常量
- [constant.js](../../app/style/constant.js)：颜色（primary、actionBlue、miWhite…）、尺寸（tabBarHeight、screenWidth、drawerWidth）。
- [style/index.js](../../app/style/index.js)：通用 StyleSheet。
- 验收：所有页面颜色/字体均使用常量，禁止硬编码 16 进制。

### 3. 缓存与数据库
- Realm Schema：[dao/db/index.js](../../app/dao/db/index.js)。
- AsyncStorage：用于 Token、语言、用户偏好。
- 验收：清缓存功能必须清空 Realm 表 + 部分非敏感 AsyncStorage（保留 Token 直到主动登出）。

### 4. 网络层
- [net/index.js](../../app/net/index.js)：fetch 统一封装、鉴权头、错误码映射。
- [net/address.js](../../app/net/address.js)：API base url、graphic host。
- [net/netwrokCode.js](../../app/net/netwrokCode.js)：错误码 → 文案。

### 5. 日志 / 错误
- 现状：`__DEV__ && console.log` 散落各处。
- 改进项（待实施）：抽取 `app/utils/logger.js` 统一打印 + 生产 sink。

### 6. 推送 / 离线（暂未启用）
- 留坑：未来若引入 FCM / APNs，需同步 [native-bridges.md](../architecture/native-bridges.md)。

## 验收测试
- 单测：`__tests__/unit/timeUtil.test.js`、`__tests__/unit/htmlUtils.test.js`。
- 手工：[manual/infra.md](../testing/manual/infra.md)。
