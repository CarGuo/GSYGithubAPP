# React Native Testing Library 指南

## 引入步骤（暂未在 package.json 注入，需要时按 ADR 流程添加）
```bash
npm i -D @testing-library/react-native @testing-library/jest-native
```

并在 `package.json` 的 jest 字段添加 `setupFilesAfterEach`：
```json
"jest": {
  "preset": "react-native",
  "setupFilesAfterEach": ["./harness/testing/jest/jest.setup.js"],
  "transformIgnorePatterns": [
    "node_modules/(?!(react-native|@react-native|react-redux|@react-navigation|react-native-vector-icons)/)"
  ]
}
```

## 使用约定
- 渲染时用 `render(<Component {...props} />)`。
- 选择器优先级：`getByRole` > `getByLabelText` > `getByTestId` > `getByText`。
- 异步：`await waitFor(() => expect(...).toBeOnTheScreen())`。
- 不去断言样式细节；以 a11y 角度断言可见性。

## 模板
```js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RepositoryItem from '../../app/components/widget/RepositoryItem';

describe('<RepositoryItem />', () => {
  const repo = { full_name: 'CarGuo/GSYGithubApp', stargazers_count: 100, forks_count: 20 };

  it('renders full name and counts', () => {
    const { getByText } = render(<RepositoryItem rowData={repo} />);
    expect(getByText('CarGuo/GSYGithubApp')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
  });

  it('triggers press', () => {
    const onPressItem = jest.fn();
    const { getByTestId } = render(
      <RepositoryItem rowData={repo} onPressItem={onPressItem} testID="repo-item" />,
    );
    fireEvent.press(getByTestId('repo-item'));
    expect(onPressItem).toHaveBeenCalled();
  });
});
```

## 注意
- 不要在组件测试中直接 import 真实的导航容器；将组件解耦为 props 驱动 + 用 mock NavigationContainer。
- WebView / Lottie / SpinKit 等三方 native 组件需要在 setup 里 mock 渲染为 View。
