# Contributing to Treclone

Thanks for helping out! These guidelines keep the codebase consistent and the
review process fast.

## Development setup

```bash
git clone https://github.com/Sleeplessmen/Treclone.git
cd Treclone
nvm use                 # or use Node 20+
npm install
cp .env.example .env.local
docker compose up -d    # PostgreSQL + Mailpit
npx prisma migrate dev
npm run dev
```

## Branching workflow

- Long-lived branches: `main` (stable) and `dev` (integration).
- Feature branches should be named `feat/<topic>` or `fix/<topic>` and be based
  on `dev`.
- After review, merge back into `dev` (squash or rebase, as preferred by the
  team). `main` is updated via releases.

## Code style

- **Formatting**: Prettier (`npx prettier --write .`). Single quotes, semicolons,
  trailing commas, 2-space indent.
- **Linting**: ESLint flat config — `npm run lint`. Keep it warning-free.
- **TypeScript**: strict mode is on. Avoid `any`; prefer typed inputs (`z.infer<...>`).
- **Imports**: use the `@/` alias for `src` and `@generated/client` for the
  Prisma client. No deep relative paths into `prisma/generated`.

## Architecture conventions

- **Never** query Prisma from a route handler or controller — go through a service
  → repository. (The activity and board-cards routes are legacy exceptions being
  migrated; don't add new ones.)
- **Never** repeat auth checks in routes — use `withMiddleware`.
- Throw `AppError(message, statusCode, code)` in services; controllers map errors
  with `handleError`.
- Validate all external input with a Zod schema from `src/lib/validation`.
- Audit mutations through `createAuditLog` where other mutations in the same
  controller already do.

## Testing

- New behavior should ship with a test.
- `npm run test:unit` — pure logic, hooks, components (jsdom, no DB).
- `npm run test:integration` — flows that touch the database
  (`docker compose up -d` first).
- `npm run test:e2e` — full API flows.
- Run `npm run test:all` before pushing.

## Pull request checklist

- [ ] Based on `dev`, clean commit history
- [ ] `npm run lint` passes
- [ ] `npm run test:all` passes locally
- [ ] New/changed behavior is covered by a test
- [ ] Environment variables added to `.env.example` (if any)
- [ ] Prisma schema changes include a committed migration
- [ ] README/ARCHITECTURE updated when relevant
