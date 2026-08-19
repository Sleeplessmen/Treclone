import fixtures from './fixtures'

export const DEFAULT_TEST_PASSWORD = 'Qa@123456'

export function getData<T>(body: unknown): T | undefined {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return undefined
    return (body as { data?: T }).data
}

export function isSuccessStatus(status: number): boolean {
    return status === 200 || status === 201
}

export function successStatuses(): [200, 201] {
    return [200, 201]
}

export async function authAs(email: string, password = DEFAULT_TEST_PASSWORD, fullName = 'QA User') {
    const result = await fixtures.registerAndLogin(email, password, fullName)

    if (!isSuccessStatus(result.loginRes.status)) {
        throw new Error(
            `Auth failed for ${email}: Status ${result.loginRes.status}. Body: ${JSON.stringify(result.loginRes.body)}`
        )
    }

    return result.cookieHeader
}
