# Mistral Eval Studio

WIP

## Requirements

- Node.js 20
- pnpm 10 (see `packageManager` in `package.json`)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 to view the app.

## Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Create a production build.
- `pnpm start`: Run the production server.
- `pnpm lint`: Run ESLint.
- `pnpm format`: Run Prettier.
- `pnpm typecheck`: Run TypeScript type checks.
- `pnpm test`: Run tests.

## Code Quality

Husky runs a pre-commit hook that triggers `lint-staged` to auto-fix linting and
formatting for staged files:

- ESLint: `*.{js,jsx,ts,tsx}`
- Prettier: `*.{js,jsx,ts,tsx,css,json,md,yml,yaml}`

See `.husky/pre-commit` and `.lintstagedrc` for details.

## CI

GitHub Actions runs on pull requests and merges to `main`:

- Install dependencies with pnpm
- Lint and typecheck
- Run tests
- Build the application

See `.github/workflows/ci.yml` for the CI pipeline.
