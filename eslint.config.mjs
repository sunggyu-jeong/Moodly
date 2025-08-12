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
    ],
  },

  // 1) JS 기본 권장
  eslint.configs.recommended,

  // 2) TS 권장(비타입체크) — 공통 규칙/플러그인
  ...tseslint.configs.recommended,

  // 3) 공통(전 파일) 규칙
  {
    plugins: {
      react: pluginReact,
      'react-native': pluginReactNative,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      import: pluginImport,
      prettier: pluginPrettier,
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
      boundaries,
    },

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.es2023,
        ...globals.node,
        __DEV__: true,
        fetch: true,
        Request: true,
        Response: true,
        FormData: true,
      },
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
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      // FSD 경계: 상향 의존 금지
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          message: 'FSD 레이어 역참조 금지',
          rules: [
            { from: ['shared', 'entities'], allow: [] },
            { from: ['features'], allow: ['shared', 'entities'] },
            { from: ['widgets'], allow: ['features', 'shared', 'entities'] },
            { from: ['pages'], allow: ['widgets', 'features', 'shared', 'entities'] },
            { from: ['processes'], allow: ['pages', 'widgets', 'features', 'shared', 'entities'] },
            {
              from: ['app'],
              allow: ['processes', 'pages', 'widgets', 'features', 'shared', 'entities'],
            },
          ],
        },
      ],

      // React / Hooks / Fast Refresh
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-bind': [
        'warn',
        { ignoreRefs: true, allowArrowFunctions: true, allowFunctions: false, allowBind: false },
      ],
      'react/jsx-key': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // React Native 전용 권장
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-raw-text': [
        'warn',
        { skip: ['Title', 'Body1', 'Body2', 'Caption', 'H1', 'H2', 'H3', 'Label'] },
      ],

      // import/정렬/미사용 제거
      'import/no-unresolved': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'error',

      // TS
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
      ],
      '@typescript-eslint/no-require-imports': 'off',

      // 품질
      'no-unused-expressions': [
        'error',
        { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-useless-return': 'warn',
      'consistent-return': 'warn',
      'no-undef': 'off',

      // Prettier 연동
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          trailingComma: 'es5',
          singleQuote: true,
          singleAttributePerLine: true,
          semi: true,
          quoteProps: 'as-needed',
          proseWrap: 'preserve',
          printWidth: 100,
          bracketSpacing: true,
          useTabs: false,
          htmlWhitespaceSensitivity: 'css',
          endOfLine: 'lf',
          embeddedLanguageFormatting: 'auto',
          tabWidth: 2,
        },
      ],
    },
  },

  // 4) 타입체크 기반 린트는 src 의 TS/TSX에만 적용
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
      },
    },
  },

  // 5) 설정/스크립트/타입정의 파일은 project 해제
  {
    files: [
      'eslint.config.mjs',
      'metro.config.js',
      'babel.config.js',
      'jest.config.ts',
      'vitest.config.ts',
      '*.config.*',
      '*rc.*',
      '**/*.d.ts',
      '.prettierrc.js',
      '.prettierrc.cjs',
    ],
    languageOptions: { parserOptions: { project: null } },
  },

  // 6) Prettier와 충돌하는 규칙 비활성화(반드시 마지막에 배치)
  configPrettier
);
