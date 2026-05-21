# 需求 — 个人主页 / 设置

## 用户故事
- **US-PRF-1**：作为登录用户，我可以查看自己的仓库 / Star / 关注 / 粉丝 / 组织。
- **US-PRF-2**：我可以查看其他用户的资料（[PersonPage](../../app/components/PersonPage.js)），并 Follow / Unfollow。
- **US-PRF-3**：我可以在设置页修改语言、清除缓存、查看版本。

## 关键路径与文件
- [MyPage.js](../../app/components/MyPage.js) / [PersonPage.js](../../app/components/PersonPage.js) / [PersonInfoPage.js](../../app/components/PersonInfoPage.js)
- [SettingPage.js](../../app/components/SettingPage.js) / [AboutPage.js](../../app/components/AboutPage.js) / [ReleasePage.js](../../app/components/ReleasePage.js)
- [BasePersonPage.js](../../app/components/widget/BasePersonPage.js)、[UserHeadItem.js](../../app/components/widget/UserHeadItem.js)
- [userDao.js](../../app/dao/userDao.js)

## 验收标准
1. MyPage 必须显示当前登录用户的统计数（Star/Follow/Followers）并支持下拉刷新。
2. PersonPage 支持多 Tab（仓库 / Star / Followers / Following）。
3. 设置页"清除缓存"必须连同 Realm 数据库一并清空，并提示成功。

## 测试矩阵
- 单测：`__tests__/unit/userDao.test.js`（关注/取关解析）。
- 组件：`__tests__/components/UserItem.test.js`。
- 手工：[manual/profile.md](../testing/manual/profile.md)。
