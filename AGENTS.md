# AGENTS.md — GSYGithubApp AI 协作守则

> 该文件是面向 AI 协作（Trae / Cursor / Copilot 等）和团队成员的统一入口。
> 所有 AI 在改动本仓库前 **必须** 先阅读本文件以及 [harness/README.md](./harness/README.md)。

## 1. 项目速览
- **应用**：GSYGithubApp，跨平台 GitHub 客户端（React Native）。
- **当前栈**：React Native `0.80.2`、React `19.1.0`、Redux + redux-thunk、React Navigation v7、Realm 20、Hermes、新架构（Fabric + TurboModules）已开启。
- **入口**：[index.js](./index.js) → [App.js](./App.js) → [AppNavigator.js](./app/navigation/AppNavigator.js)。
- **原生壳**：Android 见 [android/app/build.gradle](./android/app/build.gradle)，iOS 见 [ios/Podfile](./ios/Podfile)。
- **历史路由**：[app/router.js](./app/router.js) 仅作历史参考，实际路由是 React Navigation。

## 2. AI 工程化目录
所有架构 / 需求 / 决策 / 测试 / 回归 / 升级手册都沉淀在 [harness/](./harness)：

| 域 | 路径 | 说明 |
|---|---|---|
| 总入口 | [harness/README.md](./harness/README.md) | 工程化总览 |
| 架构 | [harness/architecture/](./harness/architecture) | 系统架构、模块、数据流、原生桥 |
| 需求 | [harness/requirements/](./harness/requirements) | 按域拆分的功能需求 |
| 决策 | [harness/decisions/](./harness/decisions) | ADR（Architecture Decision Records） |
| 迭代 | [harness/iteration/](./harness/iteration) | AI 改动日志、版本节奏 |
| 测试 | [harness/testing/](./harness/testing) | 测试矩阵、Jest/RNTL/E2E/手工 |
| 回归 | [harness/regression/](./harness/regression) | release-gate checklist |
| 手册 | [harness/playbooks/](./harness/playbooks) | RN 升级、依赖升级等 SOP |

## 3. AI 改动 SOP（强制）
1. **先读再改**：开工前阅读相关 [harness/architecture](./harness/architecture)、[harness/requirements](./harness/requirements) 与历史 [harness/iteration/CHANGELOG-AI.md](./harness/iteration/CHANGELOG-AI.md)。
2. **写计划**：复杂任务先用 TodoWrite 列计划，并参照 [harness/playbooks](./harness/playbooks) 的现成 SOP。
3. **小步快跑**：单次改动尽量聚焦一个模块；跨层改动需写 ADR 放入 [harness/decisions](./harness/decisions)。
4. **沉淀测试**：
   - 纯逻辑（utils/dao/store）→ Jest 单测，路径 `__tests__/unit/<module>.test.js`。
   - UI 组件 → React Native Testing Library，路径 `__tests__/components/<Page>.test.js`。
   - 关键链路 → E2E 用例，沉淀到 [harness/testing/e2e/](./harness/testing/e2e) 与 `e2e/`。
   - 无法自动化的操作 → 写入 [harness/testing/manual/](./harness/testing/manual) 的 Markdown 用例。
5. **写日志**：完成后追加一条记录到 [harness/iteration/CHANGELOG-AI.md](./harness/iteration/CHANGELOG-AI.md)。
6. **过 gate**：发布或合并前跑完 [harness/regression/checklist.md](./harness/regression/checklist.md)。

## 4. 编码与风格
- 模块顺序：先看相邻同类文件再下笔，沿用既有 import / 命名 / 缩进风格。
- 不主动加注释；除非 PRD 或排错强需求，否则保留代码原貌。
- 不引入未在 [package.json](./package.json) 中或本仓库 patches 中存在的库；新增依赖必须先写 ADR。
- **依赖版本红线（强约束）**：升级 / 新增依赖时只能采用 **发布时间 ≥ 15 天** 的版本；AI 不直接编辑 [package.json](./package.json)，必须由人工执行 `npm install`。
- 涉及原生改动时，必须在 [harness/playbooks/upgrade-rn.md](./harness/playbooks/upgrade-rn.md) 同步章节里登记。

## 5. 安全与隐私
- 不要提交 `app/config/ignoreConfig.js`（Github client_id/secret）。
- 不要在日志或测试快照里写入用户 token、cookie。
- iOS 隐私清单见 [ios/GSYGithubApp/PrivacyInfo.xcprivacy](./ios/GSYGithubApp/PrivacyInfo.xcprivacy)，新增三方 SDK 时同步更新。

## 6. 常用命令
```bash
npm install            # 安装依赖（自动跑 patch-package）
npm start              # Metro
npm run android        # 跑 Android
npm run ios            # 跑 iOS
npm test               # Jest（单测 + 快照）
npm run lint           # ESLint
```

## 7. 升级与里程碑
当前正在推进 **React Native 0.80 → 0.85** 升级，详细计划与进度见
[harness/playbooks/rn-0.85-upgrade-plan.md](./harness/playbooks/rn-0.85-upgrade-plan.md)。
