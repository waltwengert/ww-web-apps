# ww-web-apps

Monorepo for my web apps using TypeScript and React.

## Structure

- `apps/` - Individual applications
- `packages/` - Shared packages (UI components, utilities, etc.)

Current apps:

- `future-weight`
- `secret-santa`
- `title-case`
- `portfolio`

## Setup

1. Enable Corepack (once per machine): `corepack enable`
2. Install dependencies: `yarn install`
3. Run all builds: `yarn build`
4. Start an app:
	- `yarn start:{appName}` from repo root, or
	- `yarn start` inside that app workspace

## Common Commands

- `yarn lint` - Lint all TypeScript files in `apps/` and `packages/`
- `yarn format` - Format source files with Prettier
- `yarn test` - Run tests in all workspaces
- `yarn test:e2e` - Run Playwright smoke tests for all apps
- `yarn build` - Build all workspaces

Per-app commands from the repo root (pattern):

- `yarn start:<app-name>`
- `yarn build:<app-name>`
- `yarn test:<app-name>`

## Dependency Management

Audit outdated dependencies:

- `yarn outdated`

Upgrade dependencies:

- `yarn upgrade --latest`

Recommended post-upgrade validation:

1. `yarn install`
2. `yarn lint`
3. `yarn test`
4. `yarn build`

Check for unused dependencies:

- `yarn deps:check`

## Shared Dev Tools

- ESLint, Prettier, Husky, and lint-staged are configured at the root.
- Playwright smoke tests are configured at the root; see `e2e/README.md`.
