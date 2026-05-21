# Jest 单测说明

## 目录结构
```
__tests__/
├── App-test.js                 # 已有，整体渲染
├── unit/                        # 纯逻辑（utils / dao / store）
│   ├── timeUtil.test.js
│   ├── htmlUtils.test.js
│   ├── filterUtils.test.js
│   └── ...
├── components/                  # 组件交互（依赖 RNTL）
└── snapshots/                   # 稳定 UI 快照
```

## 命名约定
- 测试文件名：`<被测模块>.test.js`，与 src 路径同名（不重复目录层级）。
- 一个 describe 一个被测函数；嵌套 describe 按"分支 / 边界"组织。

## 通用 Mock
- `react-native` 已由 jest preset 自动 mock。
- Realm / fetch / NetInfo 等需要在 `jest.setup.js` 中 mock，参考 [harness/testing/jest/jest.setup.js](./jest.setup.js)。

## 运行
```bash
npm test                  # 跑全部（走本地 node_modules 内的 jest，秒级反馈）
npm test -- -u            # 更新快照
npm test -- htmlUtils     # 仅跑 htmlUtils 相关
```

> **重要**：必须用 `npm test`，不要用 `npx jest`。
> `npx jest` 在某些环境下会去 npm registry 现场下载 `jest`，挂代理 / 限速时会卡住几分钟才超时，看起来像"测试卡死"，其实是网络下载阶段。
> 如果 `npm test` 报"jest not found"，说明本地依赖没装齐，先：
> ```bash
> npm install            # 注意：会触发 .npmrc 的 minimum-release-age，遇到拒绝时见 RFC §1.1.4 例外流程
> ```

## 编写示例（最小骨架）
```js
import resolveTime from '../../app/utils/timeUtil';

jest.mock('../../app/style/i18n', () => (key) => key);

describe('resolveTime', () => {
  it('returns empty for falsy', () => {
    expect(resolveTime(undefined)).toBe('');
  });

  it('returns justNow for very recent times', () => {
    const now = Date.now();
    expect(resolveTime(now)).toBe('justNow');
  });
});
```

## 与 harness/requirements 的对应
- `requirements/auth.md` 的 US-AUTH-1 对应 `__tests__/unit/userDao.test.js`。
- `requirements/repository.md` 的 US-REPO-2 对应 `__tests__/unit/htmlUtils.test.js` 中 `getFullName / launchUrl / parseDiffSource`。
