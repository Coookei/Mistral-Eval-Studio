# Mistral Eval Studio

WIP

## Tech Stack

- Next.js, React, and TypeScript
- shadcn/ui with Tailwind CSS for styling
- Prisma ORM with PostgreSQL for data persistence
- Better Auth for authentication
- Resend for transactional email delivery
- pnpm for package management

## Getting Started

Follow these steps to set up the project

### Prerequisites

- Node.js 20
- pnpm 10 (see `packageManager` in `package.json`)
- PostgreSQL database
- Google and GitHub OAuth applications
- Resend API key

### 1. Clone the repository

```bash
git clone https://github.com/Coookei/Mistral-Eval-Studio.git
cd Mistral-Eval-Studio
```

### 2. Install dependencies

If you do not have pnpm installed yet, follow the [pnpm installation guide](https://pnpm.io/installation).

```bash
pnpm install
```

> This also generates the Prisma client and sets up Git pre-commit and commit-msg hooks to ensure consistent code formatting, quality and commit messages.

### 3. Configure secrets and environment

This project uses separate environment files for development and testing.

- `.env.example` - Template for development/production environment variables.
- `.env.test.example` - Template for test environment variables.

Copy these templates files:

```bash
cp .env.example .env
cp .env.test.example .env.test
```

Open the created `.env` files where all variables have been commented to help with setup, and configure the values.

- `.env` - Used for local development and production deployments.
- `.env.test` - Used for integration tests and CI.

### 4. Apply database migrations

For local development (creates the database and tables if needed):

```bash
pnpm db:migrate:dev
```

For production deployments, apply existing migrations without creating new ones:

```bash
pnpm db:migrate:prod
```

### 4. Start the development server

```bash
pnpm dev
```

Visit http://localhost:3000 to view the app.

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

## Adding a new shadcn/ui component

1. Find the component name in the [shadcn/ui docs](https://ui.shadcn.com/docs/components).
2. Generate it with pnpm:

   ```bash
   pnpm dlx shadcn@latest add <component-name>
   ```

   - You can add multiple components at once, e.g. `pnpm dlx shadcn@latest add card badge`.

3. Edit the generated component as needed. Because components are copied into the repo, edits are safe and local.
