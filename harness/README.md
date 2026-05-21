# harness/ — GSYGithubApp AI 工程化沉淀

本目录是 AI 协作的"项目大脑"，沉淀架构、需求、决策、测试、回归与升级 SOP。
更高层入口请回到根目录的 [AGENTS.md](../AGENTS.md)。

## 目录结构

```
harness/
├── README.md                         # 本文件
├── architecture/                     # 系统架构沉淀
│   ├── overview.md                   # 总览：分层 / 数据流 / 关键依赖
│   ├── modules.md                    # 模块清单：components / store / dao / utils
│   ├── data-flow.md                  # 登录、列表、详情等关键数据流
│   └── native-bridges.md             # 原生壳 / Realm / WebView / vector-icons
├── requirements/                     # 按域拆分的功能需求
│   ├── README.md
│   ├── auth.md                       # 登录、Token、双因素
│   ├── dynamic.md                    # 动态、通知
│   ├── trending.md                   # Trending 与推荐
│   ├── repository.md                 # 仓库详情、文件、提交、issue
│   ├── search.md                     # 搜索与过滤
│   ├── profile.md                    # 个人主页与设置
│   └── infra.md                      # i18n / 主题 / 缓存 / 日志
├── decisions/                        # ADR
│   ├── 0001-record-architecture-decisions.md
│   ├── 0002-adopt-harness-engineering.md
│   └── 0003-upgrade-rn-0-85.md
├── iteration/                        # 迭代节奏与变更日志
│   ├── CHANGELOG-AI.md               # AI 改动累积日志
│   └── release-cadence.md            # 版本节奏与里程碑
├── testing/                          # 测试沉淀
│   ├── strategy.md                   # 测试金字塔 + 矩阵
│   ├── jest/                         # Jest 单测说明
│   ├── rntl/                         # RNTL 组件测试说明
│   ├── e2e/                          # Detox / Maestro 用例
│   └── manual/                       # 手工回归 Markdown 用例
├── regression/                       # 发版前回归
│   ├── checklist.md                  # release-gate checklist
│   └── known-issues.md               # 已知风险与缓解
└── playbooks/                        # SOP / 操作手册
    ├── upgrade-rn.md                 # RN 升级通用 SOP
    ├── upgrade-dependency.md         # 依赖升级 SOP
    ├── add-feature.md                # 新增功能 SOP
    └── rn-0.85-upgrade-plan.md       # 当前 0.80 → 0.85 升级 RFC
```

## 使用方式（AI 与人类协同）

1. **接到任务** → 先在 `requirements/` 与 `architecture/` 找对应章节。
2. **下笔之前** → 在 `decisions/` 写 ADR（如改了重大方向）。
3. **改代码** → 同步补充对应的 Jest / RNTL / E2E / Manual 测试。
4. **完工** → 在 `iteration/CHANGELOG-AI.md` 追加一行；如影响升级，更新 `playbooks/`。
5. **发版前** → 跑 `regression/checklist.md`。

## 维护原则
- **可追溯**：所有改动可在 CHANGELOG-AI 找到时间、动机、影响。
- **可重放**：测试沉淀必须能在 `npm test` / `npm run e2e` 中重放。
- **小且活**：宁可一篇 50 行的活文档，不要 500 行的死文档；定期复盘删掉过期内容。
- **AI 友好**：所有跨文件引用使用 `[name](relative/path)` Markdown 链接，方便 AI 工具点击跳转。
