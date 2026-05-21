#!/usr/bin/env bash
# use-node.sh — 给 GSYGithubApp 项目本地切换/锁定 Node 版本（不污染全局）
#
# 工作原理：
#   1. 从仓库根 .nvmrc 读取目标版本（单一信源）。
#   2. 优先用 `n exec <ver> <cmd...>`：只把目标版本注入子进程 PATH，全局 node 不变。
#   3. 如果本地 n 缓存里没有目标版本，自动 `n install <ver>`（用户态，非 sudo）。
#   4. 不带参数时，进入子 shell 并把 Node <ver> 的 bin 注入 PATH（Ctrl-D 退出）。
#
# 用法：
#   bash scripts/use-node.sh node --version
#   bash scripts/use-node.sh npm install
#   bash scripts/use-node.sh npx react-native bundle --platform android ...
#   bash scripts/use-node.sh           # 进入带正确 Node 的子 shell
#
# 设计原则：
#   - 不修改 ~/.zshrc / ~/.bashrc。
#   - 不 sudo。
#   - 不影响 DevEco-Studio 自带的 node（它走自己的绝对路径）。
#   - n 没装时给出清晰指引。

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NVMRC_FILE="${REPO_ROOT}/.nvmrc"

if [ ! -f "${NVMRC_FILE}" ]; then
  echo "[use-node] ✗ 找不到 ${NVMRC_FILE}，请先创建 .nvmrc" >&2
  exit 1
fi

# 读取并清洗版本号
TARGET_VERSION="$(tr -d '[:space:]' < "${NVMRC_FILE}")"
if [ -z "${TARGET_VERSION}" ]; then
  echo "[use-node] ✗ .nvmrc 为空" >&2
  exit 1
fi

# 检查 n
if ! command -v n >/dev/null 2>&1; then
  cat <<'EOF' >&2
[use-node] ✗ 找不到 n（tj/n Node 版本管理器）。
  macOS 安装：brew install n
  其他平台：  npm install -g n  （需要可写的全局 npm 前缀）
EOF
  exit 1
fi

# 让 n 在用户态工作，不需要 sudo
# 默认放到 ~/.n（你也可以在 shell rc 里覆写 N_PREFIX）
: "${N_PREFIX:=$HOME/.n}"
export N_PREFIX
export PATH="${N_PREFIX}/bin:${PATH}"

# 确认本地缓存里有目标版本，没有就装（不动全局 node 软链）
if ! n which "${TARGET_VERSION}" >/dev/null 2>&1; then
  echo "[use-node] ℹ 本地 n 缓存中没有 node ${TARGET_VERSION}，开始下载安装（用户态）..." >&2
  # `n install` 会同时把它设为 n 的 current；我们只需要"缓存里有"就够，
  # 真正进程切换交给后面的 `n exec`，不依赖 n 的 current。
  n install "${TARGET_VERSION}"
fi

NODE_BIN="$(n which "${TARGET_VERSION}")"
NODE_DIR="$(dirname "${NODE_BIN}")"

if [ "$#" -eq 0 ]; then
  echo "[use-node] ✓ 进入子 shell，PATH 前置 Node ${TARGET_VERSION}（${NODE_DIR}）" >&2
  echo "[use-node]   退出请按 Ctrl-D。" >&2
  PATH="${NODE_DIR}:${PATH}" exec "${SHELL:-/bin/zsh}"
fi

# 用 n exec 跑命令：只对子进程注入 PATH，不动全局
echo "[use-node] ✓ Node ${TARGET_VERSION} (${NODE_BIN}) → $*" >&2
exec n exec "${TARGET_VERSION}" "$@"
