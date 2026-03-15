import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintRecommended from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
    {
        ignores: [
            'dist/',
            'build/',
            'node_modules/',
            'coverage/',
            '*.d.ts',
            'react-app-env.d.ts'
        ]
    },

    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                project: ['./tsconfig.json']
            },
            globals: {
                ...globals.browser,
                ...globals.es2021
            }
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'react-hooks': reactHooks,
            'simple-import-sort': simpleImportSort
        },
        settings: {
            react: {
                version: '18.2.0'
            }
        },
        rules: {
            // Base ESLint recommended rules
            ...eslintRecommended.configs.recommended.rules,

            // React Hooks
            'react-hooks/exhaustive-deps': 'warn',

            // Import grouping: external -> @ww-web-apps/* internal -> relative
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^react$', '^(?!@ww-web-apps(?:/|$))@?\\w'],
                        ['^@ww-web-apps(/.*|$)'],
                        ['^\\.']
                    ]
                }
            ],
            'simple-import-sort/exports': 'error',

            // TypeScript rules
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/semi': 'off',

            // Naming conventions
            '@typescript-eslint/naming-convention': [
                'error',

                // Variables: camelCase, PascalCase (components, styled components), or UPPER_CASE
                {
                    selector: 'variable',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow'
                },

                // Functions: camelCase
                {
                    selector: 'function',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow'
                },

                // Classes, Types, Interfaces, Enums: PascalCase
                {
                    selector: 'typeLike',
                    format: ['PascalCase']
                },

                // React components (exported function variables): PascalCase
                {
                    selector: 'variable',
                    types: ['function'],
                    modifiers: ['exported'],
                    format: ['PascalCase']
                }
            ]
        }
    }
];

export default config;
