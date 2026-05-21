# 手工回归 — 登录与会话

### MC-AUTH-01：账号密码登录（无 2FA）
- 前置：账号未启用 2FA。
- 步骤：
  1. 启动 App，进入 LoginPage。
  2. 输入用户名 / 密码。
  3. 点击登录。
- 期望：进入 MainTab，MyPage 显示当前用户信息。

### MC-AUTH-02：账号密码登录（含 2FA）
- 前置：账号开启了 GitHub 双因素。
- 步骤：
  1. 输入用户名 / 密码 → 提交。
  2. 看到 OTP 输入界面。
  3. 输入 6 位 OTP → 提交。
- 期望：登录成功；OTP 错误时弹错误提示，且可重试。

### MC-AUTH-03：OAuth 网页登录
- 步骤：
  1. LoginPage 点击"OAuth 登录"。
  2. 在 LoginWebPage 中完成 GitHub 授权。
- 期望：回跳后自动进入 MainTab。

### MC-AUTH-04：登出
- 步骤：
  1. 进入 SettingPage。
  2. 点击"退出登录"。
- 期望：返回 LoginPage；再次启动 App 时仍是 LoginPage（Token 已清除）。

### MC-AUTH-05：长期未操作 / 401 兜底
- 前置：手动撤销 Token（在 GitHub 设置页删除）。
- 步骤：触发任意需登录的请求。
- 期望：弹出会话失效提示并跳回 LoginPage。
