# E2E tests

These tests are API-driven and use the integration Vitest config.

## Coverage

- `auth.e2e.test.ts`
  - TC01: register user
  - TC02: register validation failure
  - TC03: login success
  - TC04: login failure
  - TC05: forgot password
  - TC06: change password with authenticated request
- `workspace.e2e.test.ts`
  - TC07: create workspace
  - TC08: create workspace validation failure
  - TC09: update workspace name and description
  - TC10: invite workspace member by email
- `board-list.e2e.test.ts`
  - TC11: create board in a workspace
  - TC12: create list on a board
  - TC13: reorder lists on a board
- `card.e2e.test.ts`
  - TC15: create card in a list
  - TC16: move card between lists
  - TC19: assign a card to a member

## Run

Run all E2E tests:

```bash
npx vitest -c vitest.integration.config.ts
```

Run a single file while developing:

```bash
npx vitest -c vitest.integration.config.ts tests/e2e/auth.e2e.test.ts
```

## Notes

- `E2E_BASE_URL` is used if set, otherwise the fixtures default to `http://localhost:3000`.
- The fixtures expose response headers so tests can read `Set-Cookie` values for cookie-auth flows.
- These tests prefer API-driven setup; use Playwright or another browser automation tool if you need UI-level verification.

## API vs UI

- Most tests in this folder are API-driven and exercise server routes directly (good for fast, reliable setup and assertions).
- The following tests are fully API-driven: `auth.e2e.test.ts`, `workspace.e2e.test.ts`, `board-list.e2e.test.ts`, `card.e2e.test.ts`.
- Tests that currently would require UI automation to verify (or that are implemented as placeholders) include drag-and-drop UX flows and visual interactions; consider adding Playwright tests for those scenarios if you need end-to-end UI verification.

If you want, I can scaffold a Playwright example for one drag-and-drop test.
