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

import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // 0) ignore
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
      '.pnpm/',
      '**/.pnpm/**',
      '**/node_modules/**',
    ],
  },

  // 1) base + TS parser
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
      // import/resolver: TS + alias(@ → ./src)
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
        alias: {
          map: [['@', './src']],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
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
      // React/Hooks 권장
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-bind': ['warn', { ignoreRefs: true, allowArrowFunctions: true }],

      // React Native
      'react-native/no-inline-styles': 'off',
      'react-native/no-unused-styles': 'warn',
      'react-native/no-color-literals': 'off',

      // === import/정렬/미사용 ===
      // simple-import-sort 사용 → import/order 끄기
      'import/order': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // alias/ts 경로 인식 후엔 켜도 됨
      'import/no-unresolved': 'error',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // 품질
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // 순환 참조 얕게 차단
      'import/no-cycle': ['error', { maxDepth: 2 }],

      // === FSD: 퍼블릭 API 강제 ===
      // 부정 패턴(!...)은 스키마상 허용 안 되므로 사용 금지
      // 폴더 루트("features/foo")는 허용, 하위("features/foo/**")는 금지
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/**'],
              message:
                'features는 퍼블릭 API(폴더 루트)로만 import 하세요. 예: "@/features/<name>"',
            },
            {
              group: ['@/entities/*/**'],
              message:
                'entities는 퍼블릭 API(폴더 루트)로만 import 하세요. 예: "@/entities/<name>"',
            },
            {
              group: ['@/widgets/*/**'],
              message: 'widgets는 퍼블릭 API(폴더 루트)로만 import 하세요. 예: "@/widgets/<name>"',
            },
            { group: ['@/pages/*/**'], message: 'pages 내부 파일 직접 참조 금지' },
            { group: ['@/processes/*/**'], message: 'processes 내부 파일 직접 참조 금지' },
          ],
          paths: [
            { name: '@/shared', message: '전역 배럴 금지. 구체 경로로 import 하세요.' },
            { name: '@/shared/index', message: '전역 배럴 금지. 구체 경로로 import 하세요.' },
          ],
        },
      ],

      // prettier(ESLint로 포맷 위반 감지까지)
      'prettier/prettier': 'warn',
    },
  },

  // 2) JS 권장 + Prettier 충돌 제거
  js.configs.recommended,
  configPrettier,
);
