// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginImport from 'eslint-plugin-import';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginBoundaries from 'eslint-plugin-boundaries';
import configPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
  // ignore
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      'android/',
      'ios/',
      '.expo/',
      'expo/',
      '*.min.*',
      'supabase',
      '.#'
    ]
  },

  // 기본 권장 + TS 파서
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: false, ecmaFeatures: { jsx: true } },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.es2021, ...globals.node }
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-native': pluginReactNative,
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
      boundaries: pluginBoundaries,
      prettier: pluginPrettier
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true
        }
      },
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'processes', pattern: 'src/processes/**' },
        { type: 'app', pattern: 'src/app/**' }
      ]
    },
    rules: {
      // React/Hooks
      'react/jsx-no-bind': ['warn', { ignoreRefs: true, allowArrowFunctions: true }],
      'react-native/no-inline-styles': 'off',

      // import/정렬/미사용
      'import/no-unresolved': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'error',

      // 품질
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // prettier
      'prettier/prettier': 'warn'
    }
  },

  // JS 권장 + Prettier 충돌 제거
  js.configs.recommended,
  configPrettier
);