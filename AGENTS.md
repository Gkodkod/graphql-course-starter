# Agent Context

This file is the first thing agents should read before working in this repo.
Keep it concise and update it when durable repo facts change.

## Project

Graph Hire is the demo app for the Overstacked Full Stack GraphQL course. It is
a mock job board where users can search and apply for jobs, and admins can
create and delete jobs. The project is intentionally course-oriented and is not
production ready.

## Workspace

- Package manager: `pnpm@10.15.0`
- Required runtime from README: Node.js 18+ and pnpm 10+
- Monorepo tooling: pnpm workspaces plus Turborepo
- Workspaces:
  - `apps/client`: React 18 frontend built with `react-scripts`
  - `apps/server`: Express 5 plus Apollo Server GraphQL backend
  - `packages/utils`: shared `@myorg/utils` placeholder package
- Do not use npm or yarn for installs or scripts in this repo.

## Common Commands

Run commands from the repo root unless noted otherwise.

- Install dependencies: `pnpm install`
- First-time dependency build approval: `pnpm approve-builds`
- Start both apps: `pnpm dev`
- Build all workspaces: `pnpm build`
- Run all tests: `pnpm test`
- Run GraphQL codegen: `pnpm codegen`
- Start client only: `pnpm --filter @graphql-course/client run start`
- Start server only: `pnpm --filter @graphql-course/server run start`
- Run frontend tests: `pnpm --filter @graphql-course/client run test:fe`
- Run backend tests: `pnpm --filter @graphql-course/server run test:be`
- Reset, migrate, and seed the server DB: `pnpm --filter @graphql-course/server run seed`
- Run Prisma migrations: `pnpm --filter @graphql-course/server run migrate`
- Run client GraphQL codegen directly: `pnpm --filter @graphql-course/client run codegen`

## Local App URLs

- Client dev server: `http://localhost:3000`
- GraphQL HTTP endpoint: `http://localhost:4000/graphql`
- GraphQL WebSocket endpoint: `ws://localhost:4000/graphql`

## Data And Auth

- Database: SQLite via Prisma at `apps/server/prisma/dev.db`
- Prisma schema: `apps/server/prisma/schema.prisma`
- Seed script: `apps/server/prisma/seed.ts`
- Seed users:
  - Regular user: `user@example.com` / `password123`
  - Admin user: `admin@example.com` / `password123`
- Auth uses an HTTP-only `token` cookie scoped to `localhost`.
- JWT secret is hardcoded in `apps/server/context.ts` for course simplicity.
- Passwords are stored in plain text for course simplicity.

## Backend Shape

- Server entry: `apps/server/index.ts`
- GraphQL schema assembly: `apps/server/schema.ts`
- Request context: `apps/server/context.ts`
- Sentry plugin: `apps/server/plugins/sentryPlugin.ts`
- Dataloaders: `apps/server/dataloaders/`
- Custom scalar: `apps/server/scalars/DateTime.ts`
- GraphQL entities:
  - `apps/server/entities/user`
  - `apps/server/entities/job`
  - `apps/server/entities/company`
  - `apps/server/entities/address`
- GraphQL directive implementations:
  - `apps/server/directives/auth`
  - `apps/server/directives/apollo`
- Entity folders usually contain `schema.graphql`, `resolvers.ts`, and `index.ts`.
- Update `apps/server/schema.ts` when adding a new entity, scalar, or directive.

## Current GraphQL API

- User operations:
  - `Query.me`
  - `Mutation.signup`
  - `Mutation.login`
  - `Mutation.logout`
- Job operations:
  - `Query.searchJobs`
  - `Mutation.createJob`
  - `Mutation.deleteJob`
  - `Mutation.applyForJob`
  - `Mutation.cancelApplication`
  - `Subscription.jobCreated`
- Important schema details:
  - `Job.location` is deprecated; prefer `Job.officeAddress`.
  - `Job.officeAddress` resolves to a US or UK address for non-remote jobs.
  - `Mutation.createJob` uses `@auth(role: ADMIN)`.
  - `Query.searchJobs` has `@cacheControl(maxAge: 30)`.

## Frontend Shape

- Client entry: `apps/client/src/index.tsx`
- Main app component: `apps/client/src/App.tsx`
- Apollo Client setup: `apps/client/src/client.ts`
- Router: `apps/client/src/router.tsx`
- Auth provider: `apps/client/src/providers/AuthProvider`
- Main routes:
  - `apps/client/src/routes/JobBoard`
  - `apps/client/src/routes/Profile`
  - `apps/client/src/routes/Admin`
- Shared layout and containers: `apps/client/src/containers`
- UI components: `apps/client/src/components`
- Headless UI components live in `apps/client/src/components/ui`.
- Styling uses Tailwind from `apps/client/tailwind.config.js`.

## GraphQL Codegen

- Codegen config: `apps/client/codegen.ts`
- Schema source: `apps/server/**/*.graphql`
- Operation documents: `apps/client/src/**/*.graphql`
- Generated outputs include:
  - `apps/server/types/resolvers-types.ts`
  - `apps/client/src/types/schema.json`
  - `apps/client/src/types/graphql.ts`
  - `apps/client/src/types/mock-resolvers.ts`
  - `*.generated.tsx` files next to frontend `.graphql` documents
- When editing `.graphql` schema or operation documents, run codegen and keep
  generated files in sync.

## Testing Notes

- Backend tests are colocated under `apps/server/**/*.test.ts`.
- Backend test config: `apps/server/jest.be.config.js`
- Backend test helper: `apps/server/test-utils/testServer.ts`
- Frontend tests are under `apps/client/src/**/*.test.ts?(x)`.
- Frontend test config: `apps/client/jest.fe.config.js`
- Frontend setup file: `apps/client/src/setupTests.ts`
- Frontend mock server: `apps/client/src/test-utils/mockServer.ts`
- The frontend test setup polyfills fetch, streams, `MessagePort`, and
  `MessageChannel`; preserve those unless replacing the MSW/Jest setup.
- `setupTests.ts` currently uses fake timers globally.
- Frontend mock server currently writes request logs to `apps/debug.log`.

## Repo-Specific Cautions

- There may be unrelated user edits in the worktree. Check `git status --short`
  before editing and do not revert unrelated changes.
- Keep code course-friendly and close to the existing patterns.
- Prefer generated GraphQL types over hand-written operation or resolver types.
- Prefer Prisma models and existing context helpers over ad hoc data access.
- Use `context.dataloaders` for repeated per-job application status lookups.
- Use `context.auth.user` for auth checks; admin checks usually read
  `context.auth.user?.isAdmin`.
- For mutations that touch auth cookies, use `context.auth.login` and
  `context.auth.logout`.
- Do not introduce production hardening work unless the user asks for it.
- Avoid broad refactors while completing course exercises.

## Generated And Local Artifacts

- `node_modules/`, `.turbo/`, build output, coverage, and SQLite DB files should
  not be committed.
- `pnpm-lock.yaml` is the lockfile.
- `apps/debug.log`, `apps/client/test_output.txt`, and
  `apps/client/test_output_2.txt` look like local diagnostic artifacts; do not
  depend on them for app behavior.

## Antigravity Notes

- Antigravity can use workspace rules in `.agent/rules/` when configured that
  way. This root `AGENTS.md` is kept as the portable, tool-agnostic context file
  for agents that read repo instructions automatically.
- If an Antigravity workspace rule is preferred, copy or summarize this file
  into `.agent/rules/repo-context.md` and keep this file as the concise source
  of truth.
