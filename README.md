# ww-web-apps

Monorepo for my web apps using TypeScript and React.

## Structure

- `apps/` - Individual applications
- `packages/` - Shared packages (UI components, utilities, etc.)

## Setup

1. Install dependencies: `yarn install`
2. Build shared packages: `yarn build` (or `npm run build` in each package)
3. For each app, run `yarn start` in the app directory (or `yarn start:{appName}`)

## Shared Dev Tools

- ESLint, Prettier, Husky pre-commit hooks are configured at the root.
- Run `yarn lint` to lint all code.
- Run `yarn format` to format all code.
