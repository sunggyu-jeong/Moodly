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
      '.#',
    ],
  },

  // base + TS parser
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: false, ecmaFeatures: { jsx: true } },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.es2021, ...globals.node },
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
      },
      // FSD 레이어 정의
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'entities', pattern: 'src/entities/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'widgets', pattern: 'src/widgets/**' }, // 점진 제거 대상
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'processes', pattern: 'src/processes/**' }, // 점진 제거 대상
        { type: 'app', pattern: 'src/app/**' },
      ],
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

      // 순환·역참조 차단 핵심
      'import/no-cycle': ['error', { maxDepth: 2 }],

      // FSD 단방향 의존만 허용
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          overrides: [
            // app는 최상위 오케스트레이션
            { from: 'app', allow: ['pages', 'features', 'entities', 'shared'] },
            // pages는 화면 조립
            { from: 'pages', allow: ['features', 'entities', 'shared'] },
            // widgets/processes는 점진 제거: 임시로 하향만 허용
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'processes', allow: ['features', 'entities', 'shared'] },
            // features는 도메인/공통만
            { from: 'features', allow: ['entities', 'shared'] },
            // entities는 공통만
            { from: 'entities', allow: ['shared'] },
            // shared는 자기 자신만
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],

      // 퍼블릭 API 강제 및 배럴 금지
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // 슬라이스 내부 경로 직접 참조 금지 → 각 슬라이스 index.ts만 노출
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

            // 전역 배럴 전면 금지
            '@/shared',
            '@/shared/index',
            '@/shared/**/index',

            // 위젯·프로세스 사용 축소 유도(필요 시 해제)
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
