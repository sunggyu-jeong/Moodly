// eslint.config.mjs
import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import pluginBoundaries from 'eslint-plugin-boundaries';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
      '.#',
      'babel.config.js',
      'metro.config.js',
    ],
  },

  // base + TS parser
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: false,
        ecmaFeatures: { jsx: true },
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.node,
        __DEV__: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        XMLHttpRequest: 'readonly',
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-native': pluginReactNative,
      import: pluginImport,
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
      boundaries: pluginBoundaries,
      prettier: pluginPrettier,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      // FSD 레이어 정의
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'app', pattern: 'src/app/**' },
      ],
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/jsx-no-bind': ['warn', { ignoreRefs: true, allowArrowFunctions: true }],

      // React Native
      'react-native/no-inline-styles': 'off',
      'react-native/no-unused-styles': 'warn',
      'react-native/no-color-literals': 'off',

      // import/정렬/미사용
      'import/no-unresolved': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // 품질
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // 순환·역참조 차단 핵심
      'import/no-cycle': ['error', { maxDepth: 2 }],

      // FSD 단방향 의존만 허용
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['pages', 'features', 'entities', 'shared'] },
            { from: 'pages', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['entities', 'shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],

      // 퍼블릭 API 강제 및 배럴 금지
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*', '!@/features/*/index'],
              message: 'features는 퍼블릭 API(index.ts)로만 import 하세요.',
            },
            {
              group: ['@/entities/*/*', '!@/entities/*/index'],
              message: 'entities는 퍼블릭 API(index.ts)로만 import 하세요.',
            },
            {
              group: ['@/widgets/*/*', '!@/widgets/*/index'],
              message: 'widgets는 퍼블릭 API(index.ts)로만 import 하세요.',
            },
            {
              group: ['@/pages/*/*', '!@/pages/*/index'],
              message: 'pages 내부 파일 직접 참조 금지.',
            },
            {
              group: ['@/processes/*/*', '!@/processes/*/index'],
              message: 'processes 내부 파일 직접 참조 금지.',
            },
            '@/shared',
            '@/shared/index',
            '@/shared/**/index',
            '@/widgets/**',
            '@/processes/**',
          ],
        },
      ],

      // prettier
      'prettier/prettier': 'warn',
    },
  },

  // JS 권장 + Prettier 충돌 제거
  js.configs.recommended,
  configPrettier,
);
