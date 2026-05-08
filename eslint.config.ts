import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import neostandard from 'neostandard'

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  neostandard(),
  {
    rules: {
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@typescript-eslint/no-floating-promises': 'off',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@stylistic/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'none',
            requireLast: false,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
        },
      ],
    },
  },
])
