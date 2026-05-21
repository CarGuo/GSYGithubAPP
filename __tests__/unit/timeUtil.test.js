/**
 * Tests for app/utils/timeUtil.js (boundary cases).
 * 详见 harness/requirements/infra.md 的 i18n / 缓存验收。
 */

jest.mock('../../app/style/i18n', () => {
  const fn = (key) => key;
  return { __esModule: true, default: fn };
});

jest.mock('moment/locale/zh-cn', () => ({}), { virtual: true });

import resolveTime from '../../app/utils/timeUtil';

describe('resolveTime', () => {
  it('returns empty string for falsy input', () => {
    expect(resolveTime(undefined)).toBe('');
    expect(resolveTime(null)).toBe('');
    expect(resolveTime(0)).toBe('');
  });

  it('returns justNow for very recent time', () => {
    const now = Date.now();
    expect(resolveTime(now)).toBe('justNow');
  });

  it('returns minutesAgo for ~5 minutes ago', () => {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    expect(resolveTime(fiveMinAgo)).toMatch(/minutesAgo$/);
  });

  it('returns hoursAgo for ~3 hours ago', () => {
    const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
    expect(resolveTime(threeHoursAgo)).toMatch(/hoursAgo$/);
  });

  it('returns daysAgo for ~3 days ago', () => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    expect(resolveTime(threeDaysAgo)).toMatch(/daysAgo$/);
  });
});
