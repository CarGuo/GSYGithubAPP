# 手工回归 — 个人主页 / 设置

### MC-PRF-01：MyPage 自我数据
- 步骤：登录后切换到 MyPage。
- 期望：展示当前账号头像 / 姓名 / Star / Follow / Followers。

### MC-PRF-02：他人主页
- 步骤：打开任意用户 PersonPage。
- 期望：4 个 Tab 数据可分页加载；可 Follow / Unfollow（非自己）。

### MC-PRF-03：设置 — 切换语言
- 步骤：SettingPage → 切换中文 / English。
- 期望：所有页面文案立即切换。

### MC-PRF-04：设置 — 清除缓存
- 步骤：SettingPage → 清除缓存。
- 期望：Realm 数据清空；列表恢复为远端数据；Token 仍保留（不被登出）。

### MC-PRF-05：关于 / 版本
- 步骤：AboutPage / ReleasePage。
- 期望：版本号正确（来自 react-native-version-number-fix-new）；Release 列表展示历史。
