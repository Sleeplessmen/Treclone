# E2E tests

These tests are API-driven and run against a live app server (default: http://localhost:3000).

## Coverage

- auth.e2e.test.ts
  - TC01: register user
  - TC02: register validation failure
  - TC03: login success
  - TC04: login failure
  - TC05: forgot password
  - TC06: change password with authenticated request
- workspace.e2e.test.ts
  - TC07: create workspace
  - TC08: create workspace validation failure
  - TC09: update workspace name and description
  - TC10: invite workspace member by email
- board-list.e2e.test.ts
  - TC11: create board in a workspace
  - TC12: create list on a board
  - TC13: reorder lists on a board
- card.e2e.test.ts
  - TC15: create card in a list
  - TC16: move card between lists
  - TC19: assign a card to a member

## Run

Run API E2E (Vitest)

This project includes a dedicated Vitest config for API E2E tests. Use the npm scripts for convenience.

Run all API E2E files:

```bash
npm run test:e2e
```

Run a single API E2E file:

```bash
npx vitest -c vitest.e2e.config.ts --run tests/e2e/auth.e2e.test.ts
```

Run API E2E in watch mode:

```bash
npm run test:e2e:watch
```

## UI E2E (Playwright)

Files ending with `.spec.ts` under `tests/e2e` are Playwright UI tests. Use the npm scripts below.

Run all Playwright UI specs:

```bash
npm run test:ui:e2e
```

Run a single UI spec:

```bash
npx playwright test tests/e2e/auth/login.e2e.spec.ts
```
