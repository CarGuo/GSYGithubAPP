/**
 * Tests for pure helpers in app/utils/htmlUtils.js
 * 覆盖 getFullName / isImageEnd / formName / parseDiffSource
 * 详见 harness/requirements/repository.md 的 US-REPO-2。
 */

// htmlUtils 依赖较多 native / RN 模块，统一 mock，让纯函数可被测试。
jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));
jest.mock('../../app/navigation/Actions', () => ({ Actions: {} }));
jest.mock('../../app/net/address', () => ({ graphicHost: 'https://example.com/' }));
jest.mock('../../app/style/constant', () => ({
  white: '#FFFFFF',
  miWhite: '#F8F8F8',
  primaryLightColor: '#7986CB',
  webDraculaBackgroundColor: '#282A36',
  actionBlue: '#3B5998',
}));
jest.mock('marked', () => ({ Renderer: function () {}, setOptions: jest.fn(), parse: (s) => s }));
jest.mock('highlight.js', () => ({ highlightAuto: () => ({ value: '' }), configure: jest.fn() }));

const {
  getFullName,
  isImageEnd,
  formName,
  parseDiffSource,
} = require('../../app/utils/htmlUtils');

describe('getFullName', () => {
  it('extracts owner/repo from a full url', () => {
    expect(getFullName('https://api.github.com/repos/CarGuo/GSYGithubApp')).toBe('CarGuo/GSYGithubApp');
  });

  it('handles trailing slash', () => {
    expect(getFullName('https://github.com/CarGuo/GSYGithubApp/')).toBe('CarGuo/GSYGithubApp');
  });

  it('returns last two segments even for short urls (https://github.com/ → /github.com)', () => {
    expect(getFullName('https://github.com/')).toBe('/github.com');
  });
});

describe('isImageEnd', () => {
  it.each([
    ['a.png', true],
    ['b.JPG', false], // case sensitive in current impl
    ['c.jpg', true],
    ['d.svg', true],
    ['e.txt', false],
    ['/foo/bar.gif', true],
  ])('isImageEnd(%s) -> %s', (input, expected) => {
    expect(isImageEnd(input)).toBe(expected);
  });
});

describe('formName', () => {
  it.each([
    ['sh', 'shell'],
    ['js', 'javascript'],
    ['kt', 'kotlin'],
    ['c', 'cpp'],
    ['cpp', 'cpp'],
    ['md', 'markdown'],
    ['html', 'xml'],
    ['py', 'py'],
  ])('formName(%s) -> %s', (input, expected) => {
    expect(formName(input)).toBe(expected);
  });
});

describe('parseDiffSource', () => {
  it('returns empty string for empty input', () => {
    expect(parseDiffSource('')).toBe('');
    expect(parseDiffSource(null)).toBe('');
  });

  it('marks added/removed/normal lines with hljs classes', () => {
    const diff = [
      '@@ -1,2 +1,3 @@',
      ' const a = 1;',
      '-const b = 2;',
      '+const b = 3;',
      '+const c = 4;',
    ].join('\n');

    const out = parseDiffSource(diff, true);

    expect(out).toContain('hljs-literal');
    expect(out).toContain('hljs-deletion');
    expect(out).toContain('hljs-addition');
    // wrap=true 时不输出行号前缀
    expect(out).not.toMatch(/   1   1/);
  });
});
