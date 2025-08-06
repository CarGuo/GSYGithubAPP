module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['import', { libraryName: '@ant-design/react-native' }],
    'react-native-worklets/plugin',
  ]
};
