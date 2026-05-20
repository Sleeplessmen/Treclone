import { test, expect } from '@playwright/test'

test.describe('Auth - Login E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
    })

    test('user can login successfully', async ({ page }) => {
        // Fill form
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'TestPassword123!')

        // Submit
        await page.click('button[type="submit"]')

        // Verify redirect to dashboard
        await expect(page).toHaveURL('/workspaces')
    })

    test('shows error with invalid credentials', async ({ page }) => {
        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'WrongPassword')
        await page.click('button[type="submit"]')

        // Wait for error message
        await expect(page.locator('text=Invalid credentials')).toBeVisible()
    })

    test('shows validation errors for empty fields', async ({ page }) => {
        await page.click('button[type="submit"]')

        await expect(page.locator('text=Email is required')).toBeVisible()
        await expect(page.locator('text=Password is required')).toBeVisible()
    })

    test('forgot password link navigates correctly', async ({ page }) => {
        await page.click('a:has-text("Forgot password?")')
        await expect(page).toHaveURL('/forgot-password')
    })

    test('register link navigates to signup', async ({ page }) => {
        await page.click('a:has-text("Sign up")')
        await expect(page).toHaveURL('/register')
    })
})

test.describe('Auth - Complete Registration to Login', () => {
    test('user can register and login', async ({ page }) => {
        const testEmail = `user-${Date.now()}@example.com`
        const testPassword = 'TestPassword123!'

        // Register
        await page.goto('/register')
        await page.fill('input[name="email"]', testEmail)
        await page.fill('input[name="password"]', testPassword)
        await page.fill('input[name="confirmPassword"]', testPassword)
        await page.click('button[type="submit"]')

        // Verify success (redirect or message)
        await expect(page).toHaveURL('/login')

        // Login with new account
        await page.fill('input[name="email"]', testEmail)
        await page.fill('input[name="password"]', testPassword)
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('/workspaces')
    })
})