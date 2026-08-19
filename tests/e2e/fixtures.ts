/*
 * Minimal E2E fixture helpers for API-driven setup.
 * These helpers are intentionally small and synchronous-friendly; expand as needed.
 */
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000'

type ApiResult<TBody = unknown> = {
    status: number
    body: TBody
    raw?: string
    headers: Record<string, string | null>
    setCookies: string[]
    cookieHeader: string
}

type LoginBody = {
    token?: string
    data?: {
        user?: {
            id?: string | number
            email?: string
        }
    }
}

type WorkspaceBody = {
    workspace?: {
        id?: string | number
        name?: string
        description?: string
    }
}

type MembersBody = {
    member?: {
        user?: {
            email?: string
        }
    }
    members?: Array<{
        user?: {
            email?: string
        }
    }>
}

function splitSetCookieHeader(headerValue: string | string[] | null | undefined): string[] {
    if (!headerValue) return []

    if (Array.isArray(headerValue)) {
        return headerValue
    }

    return headerValue.trim() ? headerValue.split(/,\s*(?=[^;,]+=)/) : []
}

function cookieToHeader(cookie: string): string {
    return cookie.split(';')[0].trim()
}

async function api<TBody = unknown>(path: string, opts: RequestInit = {}): Promise<ApiResult<TBody>> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(opts.headers) },
        ...opts,
    })

    const text = await res.text()

    const headers: Record<string, string | null> = {}
    res.headers.forEach((value, key) => {
        headers[key] = value
    })

    const getSetCookie = (res.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie
    const setCookies =
        typeof getSetCookie === 'function'
            ? getSetCookie.call(res.headers)
            : splitSetCookieHeader(res.headers.get('set-cookie'))

    const cookieHeader = setCookies
        .map(cookieToHeader)
        .filter(Boolean)
        .join('; ')

    try {
        return {
            status: res.status,
            body: JSON.parse(text || '{}') as TBody,
            raw: text,
            headers,
            setCookies,
            cookieHeader,
        }
    } catch {
        return {
            status: res.status,
            body: text as unknown as TBody,
            headers,
            setCookies,
            cookieHeader,
        }
    }
}

export async function createUser(email: string, password: string, fullName = 'QA User') {
    return api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
    })
}

export async function login(email: string, password: string) {
    const response = await api<LoginBody>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    })

    if (response.body && typeof response.body === 'object' && !Array.isArray(response.body)) {
        const body = response.body as Record<string, unknown>
        const accessTokenFromCookie = response.cookieHeader
            .split('; ')
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith('accessToken='))
            ?.slice('accessToken='.length)

        response.body = {
            ...body,
            token: (body.token as string | undefined) || accessTokenFromCookie,
        }
    }

    return response
}

export async function registerAndLogin(email: string, password: string, fullName = 'QA User') {
    const registerRes = await createUser(email, password, fullName)

    const verificationToken = registerRes.body && typeof registerRes.body === 'object' && !Array.isArray(registerRes.body)
        ? (registerRes.body as { data?: { verificationToken?: string } }).data?.verificationToken
        : undefined

    if (verificationToken) {
        const verifyRes = await verifyEmail(verificationToken)
        if (![200, 201].includes(verifyRes.status)) {
            throw new Error(
                `Email verification failed for ${email}: Status ${verifyRes.status}. Body: ${JSON.stringify(verifyRes.body)}`
            )
        }
    }

    const loginRes = await login(email, password)

    return {
        loginRes,
        cookieHeader: loginRes.cookieHeader || '',
    }
}

export async function verifyEmail(verificationToken: string) {
    return api('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token: verificationToken }),
    })
}

export async function createWorkspace(cookieHeader: string | undefined, data: { name: string; description?: string }) {
    return api<WorkspaceBody>('/api/workspaces', {
        method: 'POST',
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        body: JSON.stringify(data),
    })
}

export async function updateWorkspace(
    cookieHeader: string | undefined,
    workspaceId: number | string,
    data: { name?: string; description?: string }
) {
    return api<WorkspaceBody>(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        body: JSON.stringify(data),
    })
}

export async function inviteWorkspaceMember(
    cookieHeader: string | undefined,
    workspaceId: number | string,
    data: { email: string; role: string }
) {
    return api<MembersBody>(`/api/workspaces/${workspaceId}/members`, {
        method: 'POST',
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        body: JSON.stringify(data),
    })
}

export async function listWorkspaceMembers(cookieHeader: string | undefined, workspaceId: number | string) {
    return api<MembersBody>(`/api/workspaces/${workspaceId}/members`, {
        method: 'GET',
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    })
}

export async function createBoard(cookieHeader: string | undefined, workspaceId: number | string, data: { title: string; description?: string }) {
    return api(`/api/workspaces/${workspaceId}/boards`, {
        method: 'POST',
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        body: JSON.stringify(data),
    })
}

export async function createList(
    cookieHeader: string | undefined,
    workspaceId: number | string,
    boardId: number | string,
    data: { title: string }
) {
    return api(`/api/workspaces/${workspaceId}/boards/${boardId}/lists`, {
        method: 'POST',
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        body: JSON.stringify(data),
    })
}

export async function createCard(
    cookieHeader: string | undefined,
    workspaceId: number | string,
    boardId: number | string,
    listId: number | string,
    data: { title: string }
) {
    return api(`/api/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`, {
        method: 'POST',
        headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        body: JSON.stringify(data),
    })
}

const fixtures = {
    BASE_URL,
    api,
    createUser,
    login,
    registerAndLogin,
    verifyEmail,
    createWorkspace,
    updateWorkspace,
    inviteWorkspaceMember,
    listWorkspaceMembers,
    createBoard,
    createList,
    createCard,
}

export default fixtures
