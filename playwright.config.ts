import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    retries: 0,
    reporter: 'list',
    use: {
        trace: 'on-first-retry',
        browserName: 'chromium'
    },
    webServer: [
        {
            command:
                'yarn workspace @ww-web-apps/title-case start --host 127.0.0.1 --port 4173',
            url: 'http://127.0.0.1:4173',
            reuseExistingServer: true,
            timeout: 120000
        },
        {
            command:
                'yarn workspace @ww-web-apps/future-weight start --host 127.0.0.1 --port 4174',
            url: 'http://127.0.0.1:4174',
            reuseExistingServer: true,
            timeout: 120000
        },
        {
            command:
                'yarn workspace @ww-web-apps/secret-santa start --host 127.0.0.1 --port 4175',
            url: 'http://127.0.0.1:4175',
            reuseExistingServer: true,
            timeout: 120000
        },
        {
            command:
                'yarn workspace @ww-web-apps/portfolio start --host 127.0.0.1 --port 4176',
            url: 'http://127.0.0.1:4176',
            reuseExistingServer: true,
            timeout: 120000
        }
    ],
    projects: [
        {
            name: 'title-case-smoke',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: 'http://127.0.0.1:4173'
            },
            testMatch: /title-case\.spec\.ts/
        },
        {
            name: 'future-weight-smoke',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: 'http://127.0.0.1:4174'
            },
            testMatch: /future-weight\.spec\.ts/
        },
        {
            name: 'secret-santa-smoke',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: 'http://127.0.0.1:4175'
            },
            testMatch: /secret-santa\.spec\.ts/
        },
        {
            name: 'portfolio-smoke',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: 'http://127.0.0.1:4176'
            },
            testMatch: /portfolio\.spec\.ts/
        }
    ]
});
