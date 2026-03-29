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
    },

    // Restrict inline color literals; enforce centralized colour tokens in UI lib.
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        ignores: ['packages/ui/src/colors.ts', '**/*.d.ts', '**/dist/**'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector:
                        'Literal[value=/^(?:#(?:[0-9a-fA-F]{3,8})|(?:rgb|hsl)a?\\()/]',
                    message:
                        'Define color values in packages/ui/src/colors.ts and import the token instead of using inline color literals.'
                },
                {
                    selector:
                        'TemplateElement[value.raw=/(?:#(?:[0-9a-fA-F]{3,8})|(?:rgb|hsl)a?\\()/]',
                    message:
                        'Define color values in packages/ui/src/colors.ts and interpolate tokens instead of inline color literals.'
                }
            ]
        }
    },

    // apps/secret-santa: may only use SecretSanta and Base colour namespaces
    {
        files: ['apps/secret-santa/**/*.ts', 'apps/secret-santa/**/*.tsx'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@ww-web-apps/portfolio',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/future-weight',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/title-case',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/ui',
                            importNames: ['FutureWeight', 'TitleCase'],
                            message:
                                'apps/secret-santa should only use SecretSanta and Base colour namespaces.'
                        }
                    ],
                    patterns: [
                        {
                            group: [
                                'apps/portfolio/**',
                                'apps/future-weight/**',
                                'apps/title-case/**'
                            ],
                            message:
                                'Importing source files directly from other apps is disallowed. Move shared code to packages/*.'
                        }
                    ]
                }
            ]
        }
    },

    // apps/future-weight: may only use FutureWeight and Base colour namespaces
    {
        files: ['apps/future-weight/**/*.ts', 'apps/future-weight/**/*.tsx'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@ww-web-apps/portfolio',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/secret-santa',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/title-case',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/ui',
                            importNames: ['SecretSanta', 'TitleCase'],
                            message:
                                'apps/future-weight should only use FutureWeight and Base colour namespaces.'
                        }
                    ],
                    patterns: [
                        {
                            group: [
                                'apps/portfolio/**',
                                'apps/secret-santa/**',
                                'apps/title-case/**'
                            ],
                            message:
                                'Importing source files directly from other apps is disallowed. Move shared code to packages/*.'
                        }
                    ]
                }
            ]
        }
    },

    // apps/title-case: may only use TitleCase and Base colour namespaces
    {
        files: ['apps/title-case/**/*.ts', 'apps/title-case/**/*.tsx'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@ww-web-apps/portfolio',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/secret-santa',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/future-weight',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/ui',
                            importNames: ['SecretSanta', 'FutureWeight'],
                            message:
                                'apps/title-case should only use TitleCase and Base colour namespaces.'
                        }
                    ],
                    patterns: [
                        {
                            group: [
                                'apps/portfolio/**',
                                'apps/secret-santa/**',
                                'apps/future-weight/**'
                            ],
                            message:
                                'Importing source files directly from other apps is disallowed. Move shared code to packages/*.'
                        }
                    ]
                }
            ]
        }
    },

    // apps/portfolio: may only use Portfolio and Base colour namespaces
    {
        files: ['apps/portfolio/**/*.ts', 'apps/portfolio/**/*.tsx'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@ww-web-apps/secret-santa',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/future-weight',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/title-case',
                            message:
                                'Cross-app imports are disallowed. Move shared code to packages/*.'
                        },
                        {
                            name: '@ww-web-apps/ui',
                            importNames: [
                                'SecretSanta',
                                'FutureWeight',
                                'TitleCase'
                            ],
                            message:
                                'apps/portfolio should only use Portfolio and Base colour namespaces.'
                        }
                    ],
                    patterns: [
                        {
                            group: [
                                'apps/secret-santa/**',
                                'apps/future-weight/**',
                                'apps/title-case/**'
                            ],
                            message:
                                'Importing source files directly from other apps is disallowed. Move shared code to packages/*.'
                        }
                    ]
                }
            ]
        }
    },

    // packages/* may not import app code directly or via app workspaces
    {
        files: ['packages/**/*.ts', 'packages/**/*.tsx'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@ww-web-apps/portfolio',
                            message:
                                'Packages must not depend on app workspaces. Keep dependencies one-way: apps -> packages.'
                        },
                        {
                            name: '@ww-web-apps/secret-santa',
                            message:
                                'Packages must not depend on app workspaces. Keep dependencies one-way: apps -> packages.'
                        },
                        {
                            name: '@ww-web-apps/future-weight',
                            message:
                                'Packages must not depend on app workspaces. Keep dependencies one-way: apps -> packages.'
                        },
                        {
                            name: '@ww-web-apps/title-case',
                            message:
                                'Packages must not depend on app workspaces. Keep dependencies one-way: apps -> packages.'
                        }
                    ],
                    patterns: [
                        {
                            group: ['apps/**'],
                            message:
                                'Packages must not import app source files. Move shared logic into packages/* and import from there.'
                        }
                    ]
                }
            ]
        }
    }
];

export default config;
