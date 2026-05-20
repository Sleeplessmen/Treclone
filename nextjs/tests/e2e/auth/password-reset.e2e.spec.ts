import { test, expect } from '@playwright/test'

test.describe('Auth - Password Reset E2E', () => {
    test('user can reset password via email', async ({ page }) => {
        const testEmail = 'test@example.com'

        // Step 1: Go to forgot password
        await page.goto('/forgot-password')
        await page.fill('input[name="email"]', testEmail)
        await page.click('button[type="submit"]')

        // Verify success message
        await expect(
            page.locator('text=Password reset link sent to your email')
        ).toBeVisible()

        // Step 2: Simulate email link (in real test, use email API)
        // For now, we'll assume user clicks link from email
        const resetToken = 'mock-reset-token-from-email'
        await page.goto(`/reset-password?token=${resetToken}`)

        // Step 3: Set new password
        const newPassword = 'NewPassword123!'
        await page.fill('input[name="password"]', newPassword)
        await page.fill('input[name="confirmPassword"]', newPassword)
        await page.click('button[type="submit"]')

        // Verify redirect to login
        await expect(page).toHaveURL('/login')

        // Step 4: Login with new password
        await page.fill('input[name="email"]', testEmail)
        await page.fill('input[name="password"]', newPassword)
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL('/workspaces')
    })
})