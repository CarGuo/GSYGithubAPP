# scripts/

## use-node.sh
项目级 Node 版本隔离脚本。让本仓库永远用 [.nvmrc](../.nvmrc) 指定的版本（当前 `20.18.1`），同时**不动全局 PATH**，DevEco-Studio 自带的 node 18 也不受影响。

### 设计
- 单一信源：版本号写在仓库根 [.nvmrc](../.nvmrc)，n / nvm / fnm / CI 通吃。
- 子进程级切换：内部走 `n exec <ver> <cmd...>`，只把目标版本注入子进程 PATH，**不修改 `~/.zshrc`、不 sudo、不改 `/usr/local`**。
- 自动安装：本地 n 缓存里没有目标版本，会自动 `n install`（落到 `~/.n`，纯用户态）。

### 用法
```bash
bash scripts/use-node.sh node --version          # 一次性命令
bash scripts/use-node.sh npm install             # 用项目 Node 装依赖
bash scripts/use-node.sh npx react-native bundle ...
bash scripts/use-node.sh                         # 进入带正确 Node 的子 shell

# package.json 暴露的便捷脚本（推荐）
npm run node:check                # → v20.18.1
npm run bundle:android:smoke      # Metro 烟雾测试（Android）
npm run bundle:ios:smoke          # Metro 烟雾测试（iOS）
```

### 协同
- 与 [package.json#engines](../package.json) 的 `"node": ">=20.18.1 <21"` 配合。
- [.npmrc](../.npmrc) 开了 `engine-strict=true`，Node 18 跑 `npm install` 会硬失败（防止误触）。
- DevEco-Studio 走 `/Applications/DevEco-Studio.app/Contents/tools/node/bin/node` 绝对路径，**与本方案完全隔离**。

## check-package-age.js
工程化"依赖发布满 15 天才允许采用"约束的本地 / CI 自检脚本。

### 用法
```bash
node scripts/check-package-age.js                 # 校验所有依赖
node scripts/check-package-age.js react-native    # 仅校验单个
MIN_RELEASE_AGE_DAYS=20 node scripts/check-package-age.js   # 临时调阈值
STRICT=1 node scripts/check-package-age.js        # unknown 也视为失败
```

### 退出码
- 0：全部通过
- 1：至少 1 个包发布时间不足 15 天
- 2：unknown（无法解析发布时间，仅当 `STRICT=1`）

### 协同
- 与仓库根的 [.npmrc](../.npmrc) 双重保险：
  - npm 11+ 在安装期自动拒绝；
  - 本脚本可在无新版 npm 的环境里软兜底。
- 详细策略见 [harness/playbooks/upgrade-dependency.md](../harness/playbooks/upgrade-dependency.md)。
