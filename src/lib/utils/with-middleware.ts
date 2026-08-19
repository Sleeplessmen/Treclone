import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenFromCookie } from '@/lib/utils/auth'
import { rateLimit, getClientIp, rateLimitHeaders } from '@/lib/utils/rate-limit'
import { unauthorized } from '@/lib/utils/api-utils'
import { ErrorCode } from '@/lib/utils/errors'

export interface EndpointContext {
    userId: bigint
    correlationId: string
    clientIp: string
    method: string
    pathname: string
    params: Record<string, string>
}

type RouteSegmentParams = Promise<Record<string, string | string[]>>

type EndpointHandler = (
    request: NextRequest,
    context: EndpointContext
) => Promise<NextResponse>

const USER_RATE_LIMIT = { interval: 60_000, maxRequests: 500 }

function generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Wraps an authenticated API route handler with the shared cross-cutting concerns:
 * - per-IP and per-user rate limiting (429 when exceeded)
 * - JWT authentication (401 when the token is missing or invalid)
 * - a request correlation ID exposed via the X-Correlation-ID header
 * - a safety net that turns any unhandled error into a 500 response
 *
 * The wrapped handler receives a typed EndpointContext (userId, params, ...),
 * so route files no longer need to repeat auth checks.
 */
export function withMiddleware(handler: EndpointHandler) {
    return async (
        request: NextRequest,
        routeContext?: { params: RouteSegmentParams }
    ): Promise<NextResponse> => {
        const correlationId = generateCorrelationId()
        const clientIp = getClientIp(request)
        const method = request.method
        const pathname = new URL(request.url).pathname

        // Shared response headers (rate limit info + correlation ID)
        const ipLimit = rateLimit(`ip:${clientIp}`)
        const responseHeaders = new Headers(rateLimitHeaders(ipLimit))
        responseHeaders.set('X-Correlation-ID', correlationId)

        // 1. Per-IP rate limit
        if (!ipLimit.success) {
            return respondRateLimited(responseHeaders, correlationId)
        }

        // 2. Authentication
        const { valid, userId } = verifyTokenFromCookie(request)
        if (!valid || !userId) {
            return applyHeaders(unauthorized(), responseHeaders)
        }

        // 3. Per-user rate limit
        const userLimit = rateLimit(`user:${userId}`, USER_RATE_LIMIT)
        if (!userLimit.success) {
            return respondRateLimited(responseHeaders, correlationId)
        }

        // 4. Flatten route params (plain string segments for this codebase)
        const rawParams = (await routeContext?.params) ?? {}
        const params: Record<string, string> = {}
        for (const [key, value] of Object.entries(rawParams)) {
            params[key] = Array.isArray(value) ? value[0] ?? '' : value
        }

        try {
            const response = await handler(request, {
                userId,
                correlationId,
                clientIp,
                method,
                pathname,
                params,
            })
            return applyHeaders(response, responseHeaders)
        } catch (error) {
            console.error('[withMiddleware] Unhandled error:', {
                correlationId,
                pathname,
                method,
                userId: userId.toString(),
                error: error instanceof Error ? error.message : String(error),
            })

            return applyHeaders(
                NextResponse.json(
                    {
                        success: false,
                        error: 'Internal server error',
                        errorCode: ErrorCode.INTERNAL_ERROR,
                        correlationId,
                    },
                    { status: 500 }
                ),
                responseHeaders
            )
        }
    }
}

function respondRateLimited(headers: Headers, correlationId: string): NextResponse {
    return applyHeaders(
        NextResponse.json(
            {
                success: false,
                error: 'Rate limit exceeded',
                errorCode: ErrorCode.RATE_LIMITED,
                correlationId,
            },
            { status: 429 }
        ),
        headers
    )
}

function applyHeaders(response: NextResponse, headers: Headers): NextResponse {
    headers.forEach((value, key) => {
        response.headers.set(key, value)
    })
    return response
}
