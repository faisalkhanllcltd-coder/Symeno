import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import tsEslint from 'typescript-eslint';
import svelteParser from 'svelte-eslint-parser';

export default [
  // 1. Global Ignores (Replaces .eslintignore)
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.wrangler/**',
      'node_modules/**',
      'worker-configuration.d.ts'
    ]
  },

  // 2. Base Recommended Configs
  ...tsEslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginSvelte.configs.recommended,

  // 3. The Critical Fix: Svelte + TypeScript Parser Setup
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsEslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },

  // 4. Custom Rules & Overrides
  {
    rules: {
      // Turn off base rule and use TS version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          'argsIgnorePattern': '^_|^Astro$|^e$|^context$',
          'varsIgnorePattern': '^_'
        }
      ],
      // Allow 'any' but warn in production
      '@typescript-eslint/no-explicit-any': 'warn',
      // Svelte 5 runes compatibility
      'svelte/no-at-html-tags': 'warn',
      // Disable 'no-undef' for Svelte/Astro as compilers handle this better
      'no-undef': 'off'
    }
  }
];