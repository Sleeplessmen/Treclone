import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';
const TS = Date.now();
const USER = {
    fullName: `Smoke User ${TS}`,
    email: `smoke.${TS}@example.com`,
    password: 'Qa@123456',
};

test.describe('UI Smoke: login -> workspace -> board -> card', () => {
    test('real user flow + route guard/redirect', async ({ page }) => {
        // 1) Route guard: anonymous user should be redirected from protected page
        await page.goto(`${BASE_URL}/workspaces`);
        await expect(page).toHaveURL(/\/login/);

        // 2) Register user (or switch to existing seeded user login if preferred)
        await page.goto(`${BASE_URL}/register`);
        await page.getByLabel(/full name/i).fill(USER.fullName);
        await page.getByLabel(/email/i).fill(USER.email);
        await page.getByLabel(/^password$/i).fill(USER.password);
        await page.getByRole('button', { name: /register|sign up|create account/i }).click();

        // If your app keeps unverified users blocked, replace this with seed/verify helper.
        // Then continue login step below.
        await page.goto(`${BASE_URL}/login`);
        await page.getByLabel(/email/i).fill(USER.email);
        await page.getByLabel(/password/i).fill(USER.password);
        await page.getByRole('button', { name: /login|sign in/i }).click();

        // 3) Create workspace
        await expect(page).toHaveURL(/\/workspaces|\/dashboard/);
        await page.getByRole('button', { name: /create workspace|new workspace/i }).click();
        const workspaceName = `ws-smoke-${TS}`;
        await page.getByLabel(/name/i).fill(workspaceName);
        await page.getByRole('button', { name: /create|save/i }).click();
        await expect(page.getByText(workspaceName)).toBeVisible();

        // 4) Create board
        await page.getByRole('button', { name: /create board|new board/i }).click();
        const boardName = `board-smoke-${TS}`;
        await page.getByLabel(/title|name/i).fill(boardName);
        await page.getByRole('button', { name: /create|save/i }).click();
        await expect(page.getByText(boardName)).toBeVisible();

        // 5) Create list
        const listName = `todo-${TS}`;
        await page.getByRole('button', { name: /add list|create list/i }).click();
        await page.getByLabel(/title|name/i).fill(listName);
        await page.getByRole('button', { name: /add|create|save/i }).click();
        await expect(page.getByText(listName)).toBeVisible();

        // 6) Create card
        const cardName = `card-smoke-${TS}`;
        await page.getByRole('button', { name: /add card|create card/i }).first().click();
        await page.getByLabel(/title|name/i).fill(cardName);
        await page.getByRole('button', { name: /add|create|save/i }).click();
        await expect(page.getByText(cardName)).toBeVisible();

        // 7) Logout + route guard redirect check again
        await page.getByRole('button', { name: /logout|sign out/i }).click();
        await page.goto(`${BASE_URL}/workspaces`);
        await expect(page).toHaveURL(/\/login/);
    });
});