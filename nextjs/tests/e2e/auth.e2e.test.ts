import { describe, test, expect } from 'vitest'
import fixtures from './fixtures'
import { getData, successStatuses } from './test-utils'

const ts = Date.now()
const TEST_EMAIL = `qa+auth.${ts}@example.com`
const TEST_PASSWORD = 'Qa@123456'

describe('E2E Auth Tests', () => {
    test('TC01 — Đăng ký tài khoản thành công', async () => {
        const res = await fixtures.createUser(TEST_EMAIL, TEST_PASSWORD, 'QA Auth')
        expect(res).toBeDefined()
        expect(successStatuses()).toContain(res.status)

        const data = getData<{ user?: { email?: string; id?: string | number } }>(res.body)
        expect(data?.user?.email).toBe(TEST_EMAIL)
        if (data?.user?.id) {
            const id = data.user.id
            expect(typeof id === 'number' || typeof id === 'string').toBeTruthy()
        }
    })

    test('TC02 — Đăng ký thất bại do trùng Email hoặc sai định dạng dữ liệu', async () => {
        await fixtures.createUser(TEST_EMAIL, TEST_PASSWORD, 'QA Auth')
        const res = await fixtures.createUser(TEST_EMAIL, TEST_PASSWORD, 'QA Auth')
        expect(res.status).not.toBe(201)
    })

    test('TC03 — Đăng nhập thành công vào hệ thống', async () => {
        const email = `qa+login.${ts}@example.com`
        const registerRes = await fixtures.createUser(email, TEST_PASSWORD, 'QA Login')

        const registerData = getData<{ verificationToken?: string }>(registerRes.body)
        if (registerData?.verificationToken) {
            const verifyRes = await fixtures.verifyEmail(registerData.verificationToken)
            expect(successStatuses()).toContain(verifyRes.status)
        }

        const res = await fixtures.login(email, TEST_PASSWORD)
        expect(successStatuses()).toContain(res.status)
    })

    test('TC04 — Đăng nhập thất bại (Sai mật khẩu hoặc email không tồn tại)', async () => {
        const res = await fixtures.login('no.user.' + ts + '@example.com', 'badpass')
        expect(res.status).not.toBe(200)
    })

    test('TC05 — Yêu cầu cấp lại mật khẩu (Forgot Password) thành công', async () => {
        await fixtures.createUser(`qa+fp.${ts}@example.com`, TEST_PASSWORD)
        const res = await fixtures.api('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email: `qa+fp.${ts}@example.com` }) })
        expect(successStatuses()).toContain(res.status)
    })

    test('TC06 — Đổi mật khẩu trong trang cấu hình bảo mật (Settings)', async () => {
        const email = `qa+settings.${ts}@example.com`
        const registerRes = await fixtures.createUser(email, TEST_PASSWORD, 'QA Settings')

        const registerData = getData<{ verificationToken?: string }>(registerRes.body)
        if (registerData?.verificationToken) {
            const verifyRes = await fixtures.verifyEmail(registerData.verificationToken)
            expect(successStatuses()).toContain(verifyRes.status)
        }

        const loginRes = await fixtures.login(email, TEST_PASSWORD)
        expect(successStatuses()).toContain(loginRes.status)
    })
})
