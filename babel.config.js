module.exports = {
  presets: ['@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
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
          'moti/skeleton': 'moti/skeleton/react-native-linear-gradient',
          'expo-linear-gradient': 'react-native-linear-gradient',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
    [
      '@babel/plugin-transform-typescript',
      { isTSX: true, allowDeclareFields: true, onlyRemoveTypeImports: true },
    ],
    'hot-updater/babel-plugin',
    'react-native-reanimated/plugin',
  ],
};
