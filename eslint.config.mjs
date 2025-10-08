import eslint from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// React Native + TypeScript + Flat Config(v9)
// - FSD 레이어 경계(boundaries) 린트 활성화
// - Prettier, import 정렬, 미사용 코드 정리 포함
export default tseslint.config(
  // 0) 전역 ignore (기존 .eslintignore 대체)
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
    ],
  },

  // 1) JS 기본 권장
  ...expoConfig,

  // 2) 공통(전 파일) 규칙
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'], // 소스 코드에만 적용
    plugins: {
      import: pluginImport,
      prettier: pluginPrettier,
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
      boundaries,
    },
    settings: {
      // FSD 레이어 매핑
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'processes', pattern: 'src/processes/**' },
        { type: 'app', pattern: 'src/app/**' },
      ],
      // import resolver 설정
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      // FSD 경계: 상향 의존 금지
      // FIXME: 나중에 한번에 작업
      // 'boundaries/element-types': [
      //   'error',
      //   {
      //     default: 'disallow',
      //     message: 'FSD 레이어 역참조 금지',
      //     rules: [
      //       { from: ['shared'], allow: ['shared'] },
      //       { from: ['entities'], allow: ['shared', 'entities'] },
      //       { from: ['features'], allow: ['shared', 'entities', 'features'] },
      //       { from: ['widgets'], allow: ['features', 'shared', 'entities', 'widgets'] },
      //       { from: ['pages'], allow: ['widgets', 'features', 'shared', 'entities', 'pages'] },
      //       {
      //         from: ['processes'],
      //         allow: ['pages', 'widgets', 'features', 'shared', 'entities', 'processes'],
      //       },
      //       {
      //         from: ['app'],
      //         allow: ['processes', 'pages', 'widgets', 'features', 'shared', 'entities', 'app'],
      //       },
      //     ],
      //   },
      // ],

      // React / Hooks / Fast Refresh
      'react/jsx-no-bind': [
        'warn',
        { ignoreRefs: true, allowArrowFunctions: true, allowFunctions: false, allowBind: false },
      ],

      // import/정렬/미사용 제거
      'import/no-unresolved': 'off', // TypeScript가 처리하므로 off
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'error',

      // 품질 관련 규칙
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // Prettier 연동 규칙
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          trailingComma: 'all',
          singleQuote: true,
          singleAttributePerLine: true,
          semi: true,
          printWidth: 100,
          tabWidth: 2,
        },
      ],
    },
  },

  // 4) Prettier와 충돌하는 규칙 비활성화(반드시 마지막에 배치)
  configPrettier,
);
