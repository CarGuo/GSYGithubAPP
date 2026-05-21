# 需求 — 登录与会话

## 用户故事
- **US-AUTH-1**：作为用户，我希望使用 Github OAuth 登录，便于使用我的真实仓库数据。
- **US-AUTH-2**：作为用户，我希望使用基础认证（用户名 + 密码 + 双因素）登录，作为 OAuth 失败后的兜底。
- **US-AUTH-3**：作为用户，我希望应用记住我的登录态，下次自动进入主界面。
- **US-AUTH-4**：作为用户，我可以在"设置"中退出登录，并清除本地缓存。

## 关键路径与文件
- [LoginPage.js](../../app/components/LoginPage.js)：账号密码登录页（含双因素 OTP 输入）。
- [LoginWebPage.js](../../app/components/LoginWebPage.js)：OAuth 网页登录。
- [userDao.loginIn / loginOut / refreshUserInfo](../../app/dao/userDao.js)。
- [WelcomePage.js](../../app/components/WelcomePage.js)：启动页判定登录态。
- [config/index.js](../../app/config/index.js) + `app/config/ignoreConfig.js`（不入库）：CLIENT_ID / CLIENT_SECRET。

## 验收标准
1. 输入有效账号密码后，500ms 内进入主 Tab；失败时按 [netwrokCode.js](../../app/net/netwrokCode.js) 返回错误码弹 Toast。
2. 双因素账号在出现 401 + `X-GitHub-OTP` 时自动切到 OTP 输入态。
3. OAuth 登录回调写入 token 并触发 `refreshUserInfo`。
4. 退出登录后再次进入应用应回到登录页，且无残留请求 401。

## 测试矩阵
- 单测：`__tests__/unit/userDao.test.js`（mock fetch 验证 token 解析、错误分支）。
- E2E：`harness/testing/e2e/login.spec.js`（OAuth 模式跳过实际网页；账号密码登录可用 mock server）。
- 手工：[manual/auth.md](../testing/manual/auth.md)。
