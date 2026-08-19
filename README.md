# Treclone

A Trello-inspired team Kanban workspace. Built with **Next.js 15 (App Router)**, **Prisma 7**, and **PostgreSQL**.

## ✨ Features

- **Authentication** — register, login, email verification, forgot/reset password, JWT access + refresh tokens (httpOnly cookies)
- **Workspaces** — create / edit / delete, member roles (admin, member, viewer), activity feed
- **Boards & Kanban** — lists, cards, drag & drop (`@hello-pangea/dnd`), card comments, assignees
- **Members** — add by email, update roles, remove with confirmation (workspace + board level)
- **Profile & settings** — profile, change password, preferences, danger zone
- **Dark mode**, responsive dashboard, marketing landing page

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3 (App Router, Turbopack), React 19 |
| Language | TypeScript (strict) |
| Database / ORM | PostgreSQL 17 · Prisma 7 (`@prisma/adapter-pg`) |
| Styling | Tailwind CSS · Radix UI · shadcn · lucide-react · next-themes · sonner |
| Client data | TanStack React Query 5 · React Context (auth session) |
| Forms / validation | react-hook-form · Zod 4 |
| Auth | jsonwebtoken · bcryptjs · lru-cache (rate limiting) |
| Email | SMTP + Mailpit (local) / Resend (production) |
| Error tracking | @sentry/nextjs |
| Tests | Vitest (unit / integration / e2e) · Testing Library · jsdom |

## 📋 Prerequisites

- **Node.js 20+** (see `.nvmrc`)
- **Docker** — for PostgreSQL and Mailpit
- npm 9+

## 🚀 Quick Start

```bash
# 1. Install dependencies (postinstall runs `prisma generate`)
npm install

# 2. Configure the environment
cp .env.example .env.local
#    generate a secret:  openssl rand -base64 32
#    then paste it into JWT_SECRET in .env.local

# 3. Start PostgreSQL + Mailpit (emails UI: http://localhost:8025)
docker compose up -d

# 4. Apply migrations and seed demo data
npx prisma migrate dev
npx prisma db seed

# 5. Start the dev server
npm run dev
# → http://localhost:3000
```

> ⚠️ Verification emails use Mailpit locally. Open `http://localhost:8025` to read the
> verification/reset emails without a real SMTP provider.

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Clean build (`rimraf .next` + `prisma generate` + `next build`) |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:unit` | Unit tests (Vitest, jsdom) |
| `npm run test:unit:watch` | Unit tests in watch mode |
| `npm run test:integration` | Integration tests (`--mode integration`, needs DB) |
| `npm run test:e2e` | End-to-end tests (`--mode e2e`, needs DB) |
| `npm run test:all` | unit → integration → e2e |
| `npm run test:coverage` | Unit tests with coverage + thresholds |

> `test:unit`, `test:integration` and `test:e2e` share a single `vitest.config.ts`
> and are selected with `--mode`.

## 🔐 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (matches `docker-compose.yml`) | ✅ |
| `JWT_SECRET` | JWT signing secret — `openssl rand -base64 32` | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public app URL (`http://localhost:3000` in dev) | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Fallback base URL for redirects | dev |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_SECURE` | Local email via Mailpit | dev |
| `EMAIL_FROM` | Sender address | ✅ |
| `RESEND_API_KEY` | Production email (Resend) — replaces the SMTP block | prod |

## 🗂 Project Structure

```
src/
├── app/                 # App Router: (auth), (dashboard), (marketing), api/
│   └── api/             # REST route handlers (19 protected + 9 public auth routes)
├── components/          # dashboard shell, ui (shadcn)
├── contexts/            # AuthContext (session)
├── hooks/               # feature hooks: queries.ts + mutations.ts (fetch API)
├── lib/
│   ├── controllers/     # request/response layer (11)
│   ├── services/        # business logic (14, incl. email.service)
│   ├── repositories/    # Prisma data access (11)
│   ├── validation/      # Zod schemas (11)
│   ├── utils/           # auth, errors, api-utils, rate-limit, with-middleware, cn
│   ├── db/              # Prisma client singleton
│   └── types/           # audit-log types
├── styles/
└── middleware.ts        # root route guard / auth redirect
prisma/
├── schema.prisma        # 12 models
├── migrations/          # committed SQL migrations
└── seed.ts              # demo data (@faker-js/faker)
tests/
├── unit/                # jsdom, no DB
├── integration/         # real DB, --mode integration
├── e2e/                 # full API flows, --mode e2e
└── setup.ts, integration-setup.ts, utils/
```

## 🗄 Database & Prisma

```bash
npx prisma migrate dev   # apply migrations in dev
npx prisma db seed       # seed demo data
npx prisma studio        # visual data browser
npx prisma generate      # regenerate the client (auto-run on postinstall)
```

The generated Prisma client lives in `prisma/generated/` (gitignored) and is aliased
as `@generated/client` in `tsconfig.json` and `vitest.config.ts`.

## 🧪 Testing

Three suites share one `vitest.config.ts` (selected with `--mode`):

- **Unit** (`npm run test:unit`) — jsdom, `tests/unit/**/*.test.*`, coverage with thresholds
- **Integration** (`npm run test:integration`) — Node environment, real DB
- **E2E** (`npm run test:e2e`) — Node environment, real DB

Integration and e2e suites expect a running PostgreSQL instance (`docker compose up -d`)
and use `tests/integration-setup.ts` plus `tests/setup.ts`.

## 🚀 Deployment

Deploy to **Vercel** (see `vercel.json`) or any Node.js host. Configure `DATABASE_URL`,
`JWT_SECRET`, `NEXT_PUBLIC_APP_URL` and production email variables (Resend) in the
platform's environment settings. The `build` script runs `prisma generate` before
`next build`.

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design, layers, middleware, error handling
- [CONTRIBUTING.md](./CONTRIBUTING.md) — development workflow, code style, PR checklist
- [DESIGN.md](./DESIGN.md) — design system & UI conventions

