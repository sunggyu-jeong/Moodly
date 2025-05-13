module.exports = {
  ignorePatterns: ['.eslintrc.js'],
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
    node: true,
  },
  settings: {
    react: { version: 'detect' },
    'boundaries/elements': [
      { type: 'app', pattern: 'src/app/**' },
      { type: 'process', pattern: 'src/processes/**' },
      { type: 'page', pattern: 'src/pages/**' },
      { type: 'widget', pattern: 'src/widgets/**' },
      { type: 'feature', pattern: 'src/features/**' },
      { type: 'entity', pattern: 'src/entities/**' },
      { type: 'shared', pattern: 'src/shared/**' },
    ],
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  overrides: [
    {
      files: [
        'tailwind.config.js',
        'postcss.config.js',
        'global.d.ts',
        'babel.config.js',
        'index.js',
        'metro.config.js',
      ],
      parserOptions: { project: null },
    },
  ],
  plugins: [
    '@typescript-eslint',
    'react-hooks',
    'react-refresh',
    'import',
    'react-native',
    'prettier',
    'boundaries',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:boundaries/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
    'import/no-unused-modules': ['warn', { unusedExports: true, missingExports: false }],
    'no-unused-expressions': [
      'error',
      { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
    ],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      { allowShortCircuit: false, allowTernary: false, allowTaggedTemplates: false },
    ],
    'react-native/no-raw-text': [
      'error',
      {
        skip: [
          'HeaderText',
          'ActionButton',
          'SelectedEmotion',
          'NavigationBar',
          'EmotionList',
          'H1',
          'H2',
          'H3',
          'Body1',
          'Body2',
          'Caption',
          'Label',
        ],
      },
    ],
    // FIXME: - 리팩토링 완료 후 삭제
    'import/no-internal-modules': ['off', { allow: ['**/src/**'] }],
    // FIXME: - 리팩토링 완료 후 삭제
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
      },
    ],
    'boundaries/no-unknown-files': 'off',

    'no-undef': 'off',
    '@typescript-eslint/no-require-imports': 'off',
  },
};
