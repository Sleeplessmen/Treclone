# Treclone — Architecture

This document describes how Treclone is organized and why. It targets both new
contributors and anyone touching the backend or frontend layers.

**Related:** [AGENTS.md](./AGENTS.md), [DEVELOPMENT.md](./DEVELOPMENT.md), [TESTING.md](./TESTING.md)

## 1. High-level layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                         │
│  (React client components + TanStack Query hooks)                │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP (fetch, cookie-based JWT)
┌───────────────────────────────▼─────────────────────────────────┐
│  Next.js App Router                                             │
│  ├─ middleware.ts            → page-level route guard/redirect  │
│  ├─ app/page.tsx ...         → (auth)/(dashboard)/(marketing)   │
│  └─ app/api/**/route.ts      → REST endpoints                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ withMiddleware (auth + rate limit + correlation)
┌───────────────────────────────▼─────────────────────────────────┐
│  Controllers  →  Services  →  Repositories  →  Prisma  →  Postgres │
└─────────────────────────────────────────────────────────────────┘
```

The backend follows a strict 4-layer split so that business rules live in one
place, HTTP concerns stay in the routes/controllers, and data access stays in
the repositories.

## 2. Backend layers

| Layer | Location | Responsibility |
|---|---|---|
| Route handlers | `src/app/api/**/route.ts` | HTTP verbs, dynamic segments, minimal wiring |
| Controllers | `src/lib/controllers/*.controller.ts` | Parse requests, build `NextResponse`, audit logging |
| Services | `src/lib/services/*.service.ts` | Business rules, validation, authorization checks |
| Repositories | `src/lib/repositories/*.repository.ts` | Pure Prisma queries (no HTTP / no policy) |
| Database | `src/lib/db/prisma.ts` | Singleton `PrismaClient` with the Postgres adapter |

### Request flow (example: `GET /api/workspaces/42`)

1. `src/app/api/workspaces/[workspaceId]/route.ts` exports
   `export const GET = withMiddleware((request, ctx) => controller.getWorkspace(request, BigInt(ctx.params.workspaceId), ctx.userId))`.
2. `withMiddleware` verifies the JWT, applies rate limits, flattens the route
   params, and passes a typed `EndpointContext` (`userId`, `params`, ...).
3. `WorkspaceController.getWorkspace` calls `WorkspaceService.getWorkspaceById`.
4. The service checks ownership/membership, then asks `WorkspaceRepository`.
5. The repository executes the Prisma query and returns plain rows.
6. The controller wraps the result with `successResponse(...)`.

## 3. Authentication & middleware

### Page-level guard — `middleware.ts`
Next.js root middleware protects pages (`/workspaces`, `/profile`, `/settings`)
and redirects authenticated users away from auth pages.

### API-level guard — `src/lib/utils/with-middleware.ts`
Every protected API route is wrapped with `withMiddleware`, which provides:

- **Rate limiting** — per-IP (100 req/min) and per-user (500 req/min) using an
  in-memory LRU (`src/lib/utils/rate-limit.ts`); returns `429` when exceeded.
- **JWT verification** — reads the `accessToken` cookie or `Authorization: Bearer`
  header (`verifyTokenFromCookie`); returns `401` when missing/invalid.
- **Correlation ID** — every response carries `X-Correlation-ID`.
- **Error safety net** — unhandled errors become a `500` with `ErrorCode.INTERNAL_ERROR`.

### Token model
- Access token: JWT, 7 days, httpOnly cookie.
- Refresh token: JWT, 30 days, stored hashed in `refresh_tokens`, revocable.

## 4. Error handling — `src/lib/utils/errors.ts`

A single, unified error system:

- `AppError(message, statusCode, code)` — thrown by services/controllers.
- `ErrorCode` — stable machine-readable codes (`VALIDATION_ERROR`, `FORBIDDEN`, ...).
- `handleError(error)` — classifies unknown errors (Zod, JWT, AppError) into an
  `AppError` with the right HTTP status and logging.

Controllers use `handleError` + `errorResponse` to return consistent JSON:
`{ success, data?, error?, status }`.

## 5. Frontend

- **Routing groups**: `(auth)` login/register/recovery, `(dashboard)` app shell,
  `(marketing)` landing page.
- **Providers**: `AuthProvider` (user session context) and `QueryProvider`
  (TanStack Query) in the root layout.
- **Data fetching**: feature hooks in `src/hooks/<feature>/` split into
  `queries.ts` (useQuery) and `mutations.ts` (useMutation), all consuming the
  REST API via `fetch`.
- **UI**: shadcn-style primitives in `src/components/ui`, app shell in
  `src/components/dashboard`.

## 6. Data model

12 Prisma models — see `prisma/schema.prisma`:

- `User`, `RefreshToken`
- `Workspace`, `WorkspaceMember`, `AuditLog`
- `Board`, `BoardMember`, `List`, `Card`, `CardComment`
- `BoardTemplate`, `TemplateList` (not yet wired into the UI)

IDs are `BigInt` autoincrement (serialized to strings over the API via
`convertBigIntToString` in `src/lib/utils/api-utils.ts`).

## 7. Testing strategy

Xem chi tiết trong [TESTING.md](./TESTING.md)

| Suite | Command | Environment | Needs DB |
|---|---|---|---|
| Unit | `npm run test:unit` | jsdom | no |
| Integration | `npm run test:integration` | node | yes |
| E2E | `npm run test:e2e` | node | yes |

All suites share `vitest.config.ts` and are selected via `--mode`.
Integration/e2e fall back to the Docker Compose database URL
(`tests/integration-setup.ts`).

**Coverage Thresholds:** ≥ 80% for lines, functions, branches, statements (xem [TESTING.md](./TESTING.md#-test-coverage-thresholds))
