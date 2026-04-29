# Graph Hire

The demo application for the Overstacked Full Stack GraphQL course.

## Setup

1. Install dependencies: `pnpm install`
2. Approve build scripts (first-time only): `pnpm approve-builds`
3. Run the seed script: `pnpm --filter @graphql-course/server run seed`
4. Start the development servers: `pnpm dev`

> **Requires:** [pnpm](https://pnpm.io) v10+ and [Node.js](https://nodejs.org) v18+

## App Details

The application is a mock job board where users can view jobs and apply to them. Admins can create, edit, and delete jobs.

The purpose of this application is to demonstrate how to build a full stack application with GraphQL. Therefore all of the non-graphql code is done for you. You can then focus purely on the GraphQL aspects of the application.

## Monorepo Structure

This project uses **pnpm workspaces** and **Turborepo**.

```text
graphql-course-starter/
├── apps/
│   ├── client/   → React frontend (react-scripts, Apollo Client, Tailwind)
│   └── server/   → Express + Apollo GraphQL backend (Prisma, JWT)
├── packages/
│   └── utils/    → shared utility library (@myorg/utils)
├── turbo.json
└── pnpm-workspace.yaml
```

## Common Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start both client and server concurrently |
| `pnpm build` | Build all workspaces via Turborepo |
| `pnpm test` | Run all workspace tests |
| `pnpm --filter @graphql-course/client run start` | Start client only |
| `pnpm --filter @graphql-course/server run start` | Start server only |
| `pnpm --filter @graphql-course/server run seed` | Reset and seed the database |
| `pnpm --filter @graphql-course/server run migrate` | Run Prisma migrations |
| `pnpm --filter @graphql-course/client run codegen` | Run GraphQL code generation |
| `pnpm --filter @graphql-course/client run test:fe` | Run frontend tests |
| `pnpm --filter @graphql-course/server run test:be` | Run backend tests |

## Seed Data

- Regular user: `user@example.com` / `password123`
- Admin user: `admin@example.com` / `password123`

## Migration Notes

This project was migrated from a flat npm setup to pnpm + Turborepo. See [MIGRATION.md](./MIGRATION.md) for the full details of every change made.

## Notes

This application is not production ready. Some decisions were made to make the application easier to understand and more concise. For example, passwords are stored in plain text in the database.
