/**
 * Tests for app/utils/trending/StringUtil.js
 * 详见 harness/requirements/trending.md。
 */
import StringUtil from '../../app/utils/trending/StringUtil';

describe('StringUtil.trim', () => {
  it('trims leading/trailing whitespace and newlines', () => {
    expect(StringUtil.trim('  hello  ')).toBe('hello');
    expect(StringUtil.trim('\n  hi\n')).toBe('hi');
  });

  it('returns non-string input unchanged', () => {
    expect(StringUtil.trim(123)).toBe(123);
    expect(StringUtil.trim(null)).toBe(null);
    expect(StringUtil.trim(undefined)).toBe(undefined);
  });
});
