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

## 8. 文档与日志
- [ ] [harness/iteration/CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md) 追加了本次条目。
- [ ] 必要时新增 ADR。
- [ ] [harness/regression/known-issues.md](./known-issues.md) 已同步。
