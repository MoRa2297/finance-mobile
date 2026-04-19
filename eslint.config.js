import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import pluginQuery from '@tanstack/eslint-plugin-query';
import globals from 'globals';

export default [
  // Ignora file non rilevanti
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'build/**',
      'ios/**',
      'android/**',
      'coverage/**',
      'babel.config.js',
      'metro.config.js',
      '*.config.js',
      '*.config.mjs',
    ],
  },

  // Base JS recommendations
  js.configs.recommended,

  // TypeScript recommendations
  ...tseslint.configs.recommended,

  // TanStack Query
  ...pluginQuery.configs['flat/recommended'],

  // Config principale per tutti i file TS/TSX
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        __DEV__: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-native': reactNativePlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ============================================================
      // React — regole base, queste restano così
      // ============================================================
      'react/react-in-jsx-scope': 'off', // non serve con React 17+ / Expo
      'react/prop-types': 'off', // usiamo TypeScript
      'react-hooks/rules-of-hooks': 'error',

      // ============================================================
      // REGOLE TEMPORANEAMENTE RILASSATE
      // TODO: rimettere a 'error' (o abilitare) una volta fatto il cleanup
      // ============================================================

      // TODO: rialzare a 'warn' (default) una volta sistemati i useEffect/useMemo/useCallback
      // con dipendenze mancanti (~20 warning attuali, soprattutto in hooks/screens/*)
      // Attenzione: va fatto a mano, caso per caso — auto-fix può causare loop infiniti
      'react-hooks/exhaustive-deps': 'off',

      // TODO: rialzare a 'error' una volta rimosso 'any' dal codebase (~10 occorrenze)
      // Sostituire con 'unknown' + narrowing, o tipi specifici
      '@typescript-eslint/no-explicit-any': 'off',

      // TODO: rialzare a 'error' dopo aver pulito import/var inutilizzati
      // (~10 occorrenze — quasi tutte banali: import non usati nei file sheets/*)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // TODO: valutare se rimettere a 'warn' — utile per detectare StyleSheet orfani
      // Al momento 2 warning in PickerSheet.tsx, probabilmente morti
      'react-native/no-unused-styles': 'off',

      // ============================================================
      // REGOLE DISABILITATE PERMANENTEMENTE (o quasi)
      // ============================================================

      // React Native usa require() per asset locali (immagini, font) — è idiomatico
      // Non c'è motivo di rialzarla a meno di voler migrare tutti gli asset a ESM import
      '@typescript-eslint/no-require-imports': 'off',

      // Stili inline sono comuni in RN per valori dinamici (colori, dimensioni responsive)
      // Non vale la pena forzare StyleSheet.create per ogni cosa
      'react-native/no-inline-styles': 'off',

      // Tipo {} è comune per "any object" in React Native
      '@typescript-eslint/no-empty-object-type': 'off',

      // ============================================================
      // Prettier — stilistica
      // ============================================================
      'prettier/prettier': 'warn',
    },
  },

  // Prettier come ultima config per disabilitare regole che confliggono
  prettierConfig,
];
