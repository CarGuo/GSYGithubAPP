# E2E（Maestro）

## 选型
- 默认使用 [Maestro](https://maestro.mobile.dev/)：YAML 用例 + 跨平台 + 不需要侵入构建。
- 备选：Detox（如团队后续要做更深的 native 控制，再切）。

## 安装
```bash
# macOS
curl -Ls "https://get.maestro.mobile.dev" | bash
# 或
brew tap mobile-dev-inc/tap && brew install maestro
```

## 目录
```
harness/testing/e2e/
├── login.yaml
├── repository.yaml
├── search.yaml
├── flows/
│   └── reusable-login.yaml
└── README.md（本文件）
```

## 在 package.json 中（升级期接入）增加脚本
```json
"scripts": {
  "e2e:maestro": "maestro test harness/testing/e2e",
  "e2e:maestro:android": "maestro test --device emulator-5554 harness/testing/e2e",
  "e2e:maestro:ios": "maestro test --device booted harness/testing/e2e"
}
```

## 用例命名
- `<feature>.yaml`，每条聚焦单一用户故事。
- 通用步骤抽到 `flows/`，由主用例 `runFlow` 引用。

## 常见技巧
- 等待元素：`tapOn` 默认会等待出现；额外可用 `extendedWaitUntil`。
- testID：使用 `id: "<your-test-id>"`，需要在 RN 组件层加 `testID`。
- 截图：`takeScreenshot` 自动归档，便于回归对比。

## 与 harness/regression 的关系
- 每条 E2E 用例在发布前必须通过；失败用例必须在 [harness/regression/known-issues.md](../../regression/known-issues.md) 登记并指派负责人。
