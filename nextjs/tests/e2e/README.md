# API E2E Tests (Vitest)

This folder contains API end-to-end tests that run against a live app server (default: `http://localhost:3000`).

## Scope

- These are **API workflow E2E tests** written with **Vitest**.
- This suite does **not** include browser UI E2E (Playwright).

## Folder Convention

```txt
tests/e2e
+- auth/
+- workspaces/
+- boards/
+- cards/
+- support/
```

- Domain folders (`auth`, `workspaces`, `boards`, `cards`) contain test files.
- `support/` contains shared helpers (fixtures, auth helpers, parsers, common assertions).

## File Naming Convention

Use this format for all API E2E test files:

`<domain>.<flow>.e2e.test.ts`

Examples:

- `auth.login.e2e.test.ts`
- `auth.password-reset.e2e.test.ts`
- `workspace.crud.e2e.test.ts`
- `board.members.e2e.test.ts`
- `card.move.e2e.test.ts`

Rules:

- lowercase only
- kebab-case for flow names
- fixed suffix: `.e2e.test.ts`

## Run Tests

Run all API E2E tests:

```bash
npm run test:e2e
```

Run a single API E2E file:

```bash
npx vitest -c vitest.e2e.config.ts --run tests/e2e/auth/auth.login.e2e.test.ts
```

Run in watch mode:

```bash
npm run test:e2e:watch
```

## Notes

- Ensure the app server is running before executing tests.
- Prefer validating business outcomes (status code + response shape + persisted effect), not only status code.