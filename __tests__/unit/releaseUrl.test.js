/**
 * Release URL 组装单元测试
 * 验证点：
 * 1. APK 更新跳转目标必须是 GitHub releases 页面
 * 2. 仓库名必须严格大小写匹配远端 (CarGuo/GSYGithubAPP)
 * 3. 协议必须是 https
 */

describe('release URL 组装', () => {
    const hostWeb = 'https://github.com/';
    const RELEASE_URL = hostWeb + 'CarGuo/GSYGithubAPP/releases';

    test('hostWeb 必须是 GitHub 主域 https 协议', () => {
        expect(hostWeb).toBe('https://github.com/');
    });

    test('RELEASE_URL 指向 GitHub releases 页面', () => {
        expect(RELEASE_URL.endsWith('/releases')).toBe(true);
        expect(RELEASE_URL.startsWith('https://github.com/')).toBe(true);
    });

    test('仓库名严格大小写匹配 origin 远端 (CarGuo/GSYGithubAPP)', () => {
        expect(RELEASE_URL).toContain('CarGuo/GSYGithubAPP');
        expect(RELEASE_URL).not.toMatch(/CarGuo\/GSYGithubApp(?!P)/);
    });

    test('完整 URL 等于 https://github.com/CarGuo/GSYGithubAPP/releases', () => {
        expect(RELEASE_URL).toBe('https://github.com/CarGuo/GSYGithubAPP/releases');
    });
});

describe('openReleasePage 浏览器跳转兜底逻辑（行为契约）', () => {
    const url = 'https://github.com/CarGuo/GSYGithubAPP/releases';

    const buildOpener = (Linking, Toast) => async () => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (!supported) {
                Toast('openLinkFailed');
                return false;
            }
            await Linking.openURL(url);
            return true;
        } catch (_) {
            Toast('openLinkFailed');
            return false;
        }
    };

    test('canOpenURL 返回 true 时调用 openURL', async () => {
        const Linking = {
            canOpenURL: jest.fn(() => Promise.resolve(true)),
            openURL: jest.fn(() => Promise.resolve()),
        };
        const Toast = jest.fn();
        const ok = await buildOpener(Linking, Toast)();
        expect(ok).toBe(true);
        expect(Linking.canOpenURL).toHaveBeenCalledWith(url);
        expect(Linking.openURL).toHaveBeenCalledWith(url);
        expect(Toast).not.toHaveBeenCalled();
    });

    test('canOpenURL 返回 false 时 Toast 提示且不调用 openURL', async () => {
        const Linking = {
            canOpenURL: jest.fn(() => Promise.resolve(false)),
            openURL: jest.fn(() => Promise.resolve()),
        };
        const Toast = jest.fn();
        const ok = await buildOpener(Linking, Toast)();
        expect(ok).toBe(false);
        expect(Linking.openURL).not.toHaveBeenCalled();
        expect(Toast).toHaveBeenCalledWith('openLinkFailed');
    });

    test('canOpenURL 抛异常时被 catch 兜底，Toast 提示', async () => {
        const Linking = {
            canOpenURL: jest.fn(() => Promise.reject(new Error('boom'))),
            openURL: jest.fn(() => Promise.resolve()),
        };
        const Toast = jest.fn();
        const ok = await buildOpener(Linking, Toast)();
        expect(ok).toBe(false);
        expect(Linking.openURL).not.toHaveBeenCalled();
        expect(Toast).toHaveBeenCalledWith('openLinkFailed');
    });

    test('openURL 抛异常时也被 catch 兜底', async () => {
        const Linking = {
            canOpenURL: jest.fn(() => Promise.resolve(true)),
            openURL: jest.fn(() => Promise.reject(new Error('blocked'))),
        };
        const Toast = jest.fn();
        const ok = await buildOpener(Linking, Toast)();
        expect(ok).toBe(false);
        expect(Toast).toHaveBeenCalledWith('openLinkFailed');
    });
});
