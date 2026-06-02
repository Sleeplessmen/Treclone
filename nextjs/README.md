# Treclone - Collaborative Kanban Workspace App

Treclone is a Trello-inspired project management app built with Next.js, Prisma, and PostgreSQL. It focuses on team workspaces, boards, cards, member access, and activity visibility in a modern App Router codebase.

This README works as a product overview first and a developer guide second, so it can keep evolving as the app grows.

## App features

### Core product features

- **Authentication**
  Supports login, registration, email verification, forgot password, and password reset flows through dedicated auth routes.
- **Workspace management**
  Users can create, open, edit, and delete workspaces, with workspace cards showing member and board counts.
- **Board management**
  Each workspace includes board views, board creation, board editing, board membership screens, and a starred boards area.
- **Kanban workflow**
  Boards use a Kanban layout with list creation, card creation, card editing, and drag-and-drop task organization.
- **Member management**
  Workspace members can be added by email, assigned roles such as member or admin, searched, and removed when needed.
- **Activity tracking**
  Workspace activity pages group recent events with timestamps, contributors, and summaries across boards, cards, lists, and members.
- **Profile and account settings**
  Settings are split into profile, security, preferences, and danger-zone sections for account management.

### Main user flow

The current app experience follows a clear path:

1. A user signs up or logs in through the auth routes.
2. The user lands on the workspace dashboard and creates or opens a workspace.
3. Inside a workspace, the user creates boards and navigates between board, members, activity, settings, and starred views.
4. Inside a board, the user works with lists and cards through the Kanban interface.
5. The user manages account details, preferences, and security settings from the dashboard account pages.

### Available app areas

- **Marketing landing page:** Public entry point for the app at `/`.
- **Authentication routes:** `/login`, `/register`, `/verify-email`, `/forgot-password`, and `/reset-password`.
- **Workspace dashboard:** `/workspaces` for listing, creating, opening, editing, and deleting workspaces.
- **Workspace subpages:** `/workspaces/[workspaceId]`, `/members`, `/activity`, `/settings`, `/starred`, and `/edit`.
- **Board pages:** `/workspaces/[workspaceId]/boards` and `/workspaces/[workspaceId]/boards/[boardId]`.
- **Account pages:** `/profile` and `/settings` for personal account management.

### Current feature notes

#### Authentication flows

- **What it does:** Handles sign in, sign up, email verification, password recovery, and password reset.
- **Who uses it:** New users and returning users.
- **Where it appears:** `/login`, `/register`, `/verify-email`, `/forgot-password`, and `/reset-password`.
- **Current status:** Working.
- **Notes:** Good candidate for future README additions such as session behavior, validation rules, and email delivery details.

#### Workspace dashboard

- **What it does:** Lists available workspaces, shows basic counts, and allows workspace creation and deletion.
- **Who uses it:** Logged-in users managing team spaces.
- **Where it appears:** `/workspaces`.
- **Current status:** Working.
- **Notes:** The UI already exposes empty, loading, and error states, which are worth documenting later with screenshots.

#### Workspace member management

- **What it does:** Adds members by email, updates roles, filters the member list, and removes members with confirmation.
- **Who uses it:** Workspace owners and admins.
- **Where it appears:** `/workspaces/[workspaceId]/members`.
- **Current status:** Working.
- **Notes:** Role rules and invitation behavior are good follow-up details for a deeper README pass.

#### Board and Kanban experience

- **What it does:** Opens boards inside a workspace and renders a Kanban board for managing lists and cards.
- **Who uses it:** Workspace members collaborating on tasks.
- **Where it appears:** `/workspaces/[workspaceId]/boards` and `/workspaces/[workspaceId]/boards/[boardId]`.
- **Current status:** Working.
- **Notes:** This section can later expand with drag-and-drop behavior, card fields, labels, due dates, or assignment rules if those are added.

#### Activity log

- **What it does:** Shows recent workspace events grouped by day with contributor names and relative timestamps.
- **Who uses it:** Team members who need visibility into recent changes.
- **Where it appears:** `/workspaces/[workspaceId]/activity`.
- **Current status:** Working.
- **Notes:** This is useful for documenting auditability and collaboration history once the event model is finalized.

#### Account settings

- **What it does:** Organizes account management into profile, security, preferences, and destructive account actions.
- **Who uses it:** Logged-in users managing their own account.
- **Where it appears:** `/settings` and `/profile`.
- **Current status:** Working.
- **Notes:** If theme, notification, or password policies become more detailed, this section should be expanded first.

## Product overview

Treclone is organized around collaborative workspaces. A user can sign in, create a workspace, invite teammates, create boards inside that workspace, and manage work using a Kanban-style board with lists and cards. The dashboard also includes member management, activity history, and account settings so the app feels like a complete product instead of a single board demo.

If you are updating this README over time, treat the `App features` section as the source of truth for user-facing capabilities and use the rest of this file for setup, architecture, and contributor guidance.

## Tech stack

- Next.js 15 with App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- React Query
- NextAuth
- Vitest
- Playwright

## Requirements

- Node.js 18+
- npm, pnpm, or yarn
- PostgreSQL database access

## Getting started

1. Install dependencies.

```bash
npm install
```

2. Create a `.env` file in the project root and add your database connection:

```bash
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
```

3. Apply migrations and generate the Prisma client:

```bash
npx prisma migrate dev --name init
```

4. Seed the database:

```bash
npx prisma db seed
```

5. Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

## Useful scripts

- `npm run dev` starts the app in development mode.
- `npm run build` creates a production build.
- `npm run start` runs the production server.
- `npm run test` runs the default Vitest suite.
- `npm run test:all` runs unit, integration, and e2e Vitest suites.
- `npm run test:ui` runs Playwright browser tests.

## Project structure

- [layout.tsx](/e:/SD/Treclone/nextjs/src/app/layout.tsx) defines the root app layout.
- [src/app/(auth)](/e:/SD/Treclone/nextjs/src/app/%28auth%29) contains login, register, and recovery flows.
- [src/app/(dashboard)](/e:/SD/Treclone/nextjs/src/app/%28dashboard%29) contains workspace, board, profile, and settings screens.
- [src/app/api](/e:/SD/Treclone/nextjs/src/app/api) contains API route handlers.
- [src/hooks](/e:/SD/Treclone/nextjs/src/hooks) contains feature-level queries and mutations.
- [prisma/schema.prisma](/e:/SD/Treclone/nextjs/prisma/schema.prisma) defines the data model.
- [prisma/seed.ts](/e:/SD/Treclone/nextjs/prisma/seed.ts) seeds local development data.

## Database and Prisma

- Update `DATABASE_URL` in `.env` to point to your local or hosted PostgreSQL instance.
- Commit Prisma migrations from `prisma/migrations` so other developers can apply the same schema.
- Run `npx prisma generate` after schema changes if the Prisma client needs to be refreshed manually.

Common commands:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma migrate diff
npx prisma studio
```

## Testing

The project includes multiple testing layers:

- `npm run test` for unit coverage.
- `npm run test:integration` for integration scenarios.
- `npm run test:e2e` for end-to-end Vitest flows.
- `npm run test:ui` for Playwright browser tests.

Example:

```bash
npm run test
```

## Build and deployment

Create a production build:

```bash
npm run build
```

Run the built app:

```bash
npm run start
```

Treclone can be deployed to Vercel or any Node.js host that supports Next.js and PostgreSQL-backed apps. Make sure environment variables such as `DATABASE_URL` and any auth-related secrets are configured in the deployment environment.

## Contributing

Suggested workflow:

1. Fork the repo.
2. Create a feature branch.
3. Add tests for new behavior.
4. Run migrations and seed locally.
5. Open a pull request with a clear description.

## Troubleshooting

- If Prisma complains about a missing client, run `npx prisma generate`.
- If migrations fail, check `prisma/migrations` and the database connection in `.env`.
- If auth flows fail locally, verify your environment variables and any token or mail-related configuration.
- On Windows, ensure environment variables load correctly and line endings stay consistent.

## License

Add a `LICENSE` file if you want to make usage terms explicit for collaborators or public distribution.
