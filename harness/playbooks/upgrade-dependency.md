# SOP — 三方依赖升级

## 流程
1. **登记**：在 PR 描述里列出"老版本 → 新版本 + 升级理由"。
2. **15 天冷却期校验（强约束）**：目标版本必须 **发布 ≥ 15 天**。检查命令：
   ```bash
   npm view <pkg> time --json | python3 -c "import sys,json,datetime; d=json.load(sys.stdin); print(d['<version>'])"
   ```
   不满足者一律换更老的稳定版本。
3. **变更日志**：阅读三方 CHANGELOG / Migration Guide。
4. **patches 复核**：若被升级库存在 patches/，用 `npx patch-package <pkg> --create` 重新生成。
5. **依赖联动**：常见联动
   - reanimated ↔ babel plugin / worklets / RN 版本
   - react-navigation/* ↔ screens / safe-area-context
   - realm ↔ NDK / Kotlin / RN 版本
6. **测试**：至少跑 `npm test` 与对应业务页面手工冒烟。
7. **沉淀**：影响公共 API 时写 ADR；记入 [iteration/CHANGELOG-AI.md](../iteration/CHANGELOG-AI.md)。

## 安全清单
- [ ] 不引入未审计的小库。
- [ ] 同一库不要锁定到 git 分支版本（除非历史 fork）。
- [ ] 锁定版本（^ vs ~）符合稳定性要求；核心库尽量收紧。

## 自动化建议
- 引入 `npm audit` / `npm outdated` 周报告。
- 关键库（RN、reanimated、navigation、realm）单独跟踪 release。
