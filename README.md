# Mistral Eval Studio

WIP

## Requirements

- Node.js 20
- pnpm 10 (see `packageManager` in `package.json`)
- PostgreSQL database

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 to view the app.

## Environment variables

This project uses separate environment files for development and testing.

- `.env.example` - Template for development/production environment variables.
- `.env.test.example` - Template for test environment variables.

You should copy these templates and fill in the required values:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

- `.env` - Used for local development and production deployments.
- `.env.test` - Used for integration tests and CI.

## Scripts

### Application

- `pnpm dev` - Start the Next.js development server.
- `pnpm build` - Create a production build.
- `pnpm start` - Run the production server.

### Code quality

- `pnpm lint` - Run ESLint.
- `pnpm format` - Run Prettier to format files.
- `pnpm typecheck` - Run TypeScript type checks.
- `pnpm test` - Run the test suite.

### Database (Prisma)

- `pnpm db:migrate:dev`
  - Intended to be run during development.
  - Creates a new Prisma migration from `schema.prisma` if there are changes.
  - Applies the migration to the database, loading environment variables from `.env`.
  - Regenerates the Prisma client.

- `pnpm db:migrate:test`
  - Intended for integration tests and CI.
  - Applies all existing migrations to the test database, loading environment variables from `.env.test`.

- `pnpm db:migrate:prod`
  - Intended to be run during deployment.
  - Applies all existing migrations to the database, loading environment variables from `.env`.

Prisma Client is automatically generated on install via the `postinstall` script.

## Code Quality

Husky runs a pre-commit hook that triggers `lint-staged` to auto-fix linting and
formatting for staged files:

- ESLint: `*.{js,jsx,ts,tsx}`
- Prettier: `*.{js,jsx,ts,tsx,css,json,md,yml,yaml}`

See `.husky/pre-commit` and `.lintstagedrc` for details.

Commit messages are validated by Commitlint via the Husky `commit-msg` hook:

- Config: `commitlint.config.mjs`
- Hook: `.husky/commit-msg`

## CI

GitHub Actions runs on pull requests and merges to `main`:

- Install dependencies with pnpm
- Lint and typecheck
- Launch a PostgreSQL service for tests and migrations
- Run tests
- Build the application

See `.github/workflows/ci.yml` for the CI pipeline.
