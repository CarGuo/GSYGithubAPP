module.exports = {
  root: true,
  extends: '@react-native',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      babelrc: false,
      configFile: false,
      presets: ['@react-native/babel-preset'],
      plugins: [['@babel/plugin-proposal-decorators', {legacy: true}]],
    },
  },
  overrides: [
    {
      files: ['harness/testing/jest/**/*.js'],
      env: {
        jest: true,
        'jest/globals': true,
      },
    },
  ],
};
