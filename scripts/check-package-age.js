#!/usr/bin/env node
/**
 * check-package-age.js
 *
 * 工程化"发布满 15 天才允许采用"的硬约束。
 *
 * 用法：
 *   node scripts/check-package-age.js              # 默认读 package.json，校验 dependencies + devDependencies
 *   node scripts/check-package-age.js react-native # 只校验单个包当前已锁定版本
 *   MIN_RELEASE_AGE_DAYS=20 node scripts/check-package-age.js  # 临时覆盖阈值
 *
 * 接入位置（建议）：
 *   1. package.json 的 "scripts" 增加 "check:age": "node scripts/check-package-age.js"
 *   2. package.json 的 "scripts" 增加 "preinstall": "node scripts/check-package-age.js || true"
 *      （首次接入用 || true 软告警；稳定后去掉 || true 变硬阻断）
 *   3. CI（GitHub Actions / GitLab CI）在 npm install 前先跑 npm run check:age
 *
 * 退出码：
 *   0 全部通过
 *   1 至少有一个包不满足 ≥ 15 天
 *   2 网络 / 解析错误（可由 CI 决定是否阻断）
 *
 * 备注：
 *   - 该脚本只读 package.json 中明确写出的版本（exact 或 ^/~），不解析 package-lock；
 *     完整覆盖请配合 npm 11+ 的 `cooldown`/`minimumReleaseAge` 配置（见 .npmrc）。
 *   - 不依赖任何三方库，可在升级期内单独使用。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MIN_DAYS = Number(process.env.MIN_RELEASE_AGE_DAYS || 15);
const NOW = Date.now();

function loadPackageJson() {
  const file = path.join(process.cwd(), 'package.json');
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function resolveVersion(rangeOrUrl) {
  if (!rangeOrUrl) return null;
  if (rangeOrUrl.startsWith('git+') || rangeOrUrl.startsWith('http') || rangeOrUrl.includes('/')) {
    return null;
  }
  return rangeOrUrl.replace(/^[\^~]/, '');
}

function fetchPublishTime(pkg, version) {
  try {
    const out = execSync(`npm view ${pkg}@${version} time.${version}`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (!out) return null;
    return new Date(out);
  } catch (_e) {
    try {
      const fallback = execSync(`npm view ${pkg} time --json`, {
        stdio: ['ignore', 'pipe', 'ignore'],
      }).toString();
      const obj = JSON.parse(fallback);
      if (obj[version]) return new Date(obj[version]);
      return null;
    } catch (_e2) {
      return null;
    }
  }
}

function check(pkg, version) {
  const v = resolveVersion(version);
  if (!v) {
    return { pkg, version, status: 'skip', reason: 'non-semver source (git/url)' };
  }
  const publishedAt = fetchPublishTime(pkg, v);
  if (!publishedAt) {
    return { pkg, version: v, status: 'unknown', reason: 'cannot resolve publish time' };
  }
  const ageDays = (NOW - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
  return {
    pkg,
    version: v,
    publishedAt: publishedAt.toISOString(),
    ageDays: Math.round(ageDays * 10) / 10,
    status: ageDays >= MIN_DAYS ? 'ok' : 'fail',
  };
}

function main() {
  const pkgJson = loadPackageJson();
  const targets = process.argv.slice(2);

  const entries = [];
  if (targets.length > 0) {
    for (const name of targets) {
      const v =
        (pkgJson.dependencies || {})[name] || (pkgJson.devDependencies || {})[name] || null;
      if (!v) {
        console.error(`[skip] ${name}: not in package.json`);
        continue;
      }
      entries.push([name, v]);
    }
  } else {
    Object.entries(pkgJson.dependencies || {}).forEach((kv) => entries.push(kv));
    Object.entries(pkgJson.devDependencies || {}).forEach((kv) => entries.push(kv));
  }

  let failCount = 0;
  let unknownCount = 0;
  const rows = [];
  for (const [name, range] of entries) {
    const r = check(name, range);
    rows.push(r);
    if (r.status === 'fail') failCount += 1;
    if (r.status === 'unknown') unknownCount += 1;
  }

  rows.sort((a, b) => {
    const order = { fail: 0, unknown: 1, skip: 2, ok: 3 };
    return order[a.status] - order[b.status];
  });

  for (const r of rows) {
    const tag = r.status.toUpperCase().padEnd(7);
    const age = r.ageDays != null ? `${r.ageDays}d` : '-';
    console.log(`[${tag}] ${r.pkg}@${r.version} (age=${age})${r.reason ? ' ' + r.reason : ''}`);
  }

  console.log(
    `\nSummary: ${rows.length} packages | fail=${failCount} | unknown=${unknownCount} | threshold=${MIN_DAYS}d`,
  );

  if (failCount > 0) process.exit(1);
  if (unknownCount > 0 && process.env.STRICT === '1') process.exit(2);
  process.exit(0);
}

main();
