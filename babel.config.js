module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@app': './src/app',
            '@processes': './src/processes',
            '@pages': './src/pages',
            '@widgets': './src/widgets',
            '@features': './src/features',
            '@entities': './src/entities',
            '@shared': './src/shared',
            '@components': './src/components',
          },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      // 'hot-updater/babel-plugin',
      // Reanimated 플러그인은 항상 마지막에 위치해야 합니다.
      'react-native-reanimated/plugin',
    ],
  };
};