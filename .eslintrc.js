const reactNative = require('eslint-plugin-react-native');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2021: true,
  },
  globals: globals.browser,
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      typescript: {},
    },
  },
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-refresh',
    'import',
    'react-native',
    'prettier',
  ],
  extends: [
    '@feature-sliced',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { args: 'none', ignoreRestSiblings: true },
    ],
    'import/no-unused-modules': ['warn', { unusedExports: true, missingExports: false }],
    'no-unused-expressions': [
      'error',
      { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
    ],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
    ],
  },
};
