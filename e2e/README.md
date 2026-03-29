# Playwright E2E Tests

This repo uses Playwright for root-level E2E checks across all apps.

## What These Tests Cover

The tests live in `e2e/` and verify each apps E2E behaviour:

- `e2e/title-case.spec.ts`
- `e2e/future-weight.spec.ts`
- `e2e/secret-santa.spec.ts`
- `e2e/portfolio.spec.ts`

## Setup

1. Install dependencies from repo root:

```bash
yarn
```

2. Install Playwright Chromium browser:

```bash
yarn playwright install chromium
```

If Chromium fails to launch due to missing system libraries on Linux, run:

```bash
yarn playwright install --with-deps chromium
```

## Running E2E Tests

From repo root:

```bash
yarn test:e2e
```

Run in headed mode:

```bash
yarn test:e2e:headed
```

## How It Works

- Configuration: `playwright.config.ts`
- Playwright starts one Vite dev server per app on dedicated ports:
    - Title Case: `4173`
    - Future Weight: `4174`
    - Secret Santa: `4175`
    - Portfolio: `4176`
- Each Playwright project targets one app via its `baseURL`.

## CI

CI runs these in the `E2E` job in `.github/workflows/ci.yml` using:

```bash
yarn playwright install --with-deps chromium
yarn test:e2e
```

## Artifacts

Generated Playwright artifacts are gitignored:

- `test-results/`
- `playwright-report/`
- `blob-report/`
