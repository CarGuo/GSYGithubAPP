/**
 * Jest 全局 setup（已通过 package.json 的 jest.setupFiles 引入）。
 */

// 0. react-native-gesture-handler 官方 jest setup
require('react-native-gesture-handler/jestSetup');

// 0.0.1 兜底：gesture-handler 2.31.x 在 RN 0.85 新架构下，
// `NativeRNGestureHandlerModule` 仍走 TurboModuleRegistry.getEnforcing；
// jestSetup 的 path-mock 解析有时不命中，直接 mock 该 spec 文件。
jest.mock('react-native-gesture-handler/src/specs/NativeRNGestureHandlerModule', () => ({
  __esModule: true,
  default: {
    handleSetJSResponder: jest.fn(),
    handleClearJSResponder: jest.fn(),
    createGestureHandler: jest.fn(),
    attachGestureHandler: jest.fn(),
    updateGestureHandler: jest.fn(),
    dropGestureHandler: jest.fn(),
    install: jest.fn(),
    flushOperations: jest.fn(),
  },
}));

// 0.1 react-native-reanimated mock
jest.mock('react-native-reanimated', () => {
  try {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
  } catch (_e) {
    return {};
  }
});

// 1. mock react-native-localize（避免原生模块在测试中报错）
jest.mock('react-native-localize', () => ({
  getLocales: () => [{ countryCode: 'US', languageTag: 'en-US', languageCode: 'en', isRTL: false }],
  getNumberFormatSettings: () => ({ decimalSeparator: '.', groupingSeparator: ',' }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'US',
  getCurrencies: () => ['USD'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'Asia/Shanghai',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// 2. mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// 3. mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
  addEventListener: jest.fn(),
}));

// 4. mock Realm（业务测试不应直接触达 Realm；通过 dao 抽象）
jest.mock('realm', () => {
  class FakeRealm {
    static open() { return Promise.resolve(new FakeRealm()); }
    objects() { return []; }
    write(fn) { fn(); }
    create() {}
    delete() {}
    close() {}
  }
  return { __esModule: true, default: FakeRealm };
});

// 5. silence noisy console.log in tests but keep warn/error
const noop = () => {};
global.__DEV__ = false;
const origLog = console.log;
console.log = noop;
afterAll(() => {
  console.log = origLog;
});
