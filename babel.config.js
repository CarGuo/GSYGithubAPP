module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['import', { libraryName: '@ant-design/react-native' }] // 与 Web 平台的区别是不需要设置 style
  ]
};
