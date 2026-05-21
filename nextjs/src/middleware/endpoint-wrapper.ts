import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp, rateLimitHeaders } from '@/lib/utils/rate-limit'
import { AuditAction, AuditEntity } from '@/lib/types/audit-log'
import { createAuditLog } from '@/lib/services/audit.service'
import { captureException, generateCorrelationId, ErrorCode } from '@/lib/utils/error-tracking'
import { verifyTokenFromCookie } from '@/lib/utils/auth'

export interface EndpointContext {
    correlationId: string
    clientIp: string
    userId?: bigint
    method: string
    endpoint: string
    entity: AuditEntity
}

interface AuditEventInput {
    userId: bigint | null
    method: string
    entity: AuditEntity
    endpoint: string
    clientIp: string
    userAgent?: string
    correlationId: string
    status: 'SUCCESS' | 'FAILURE'
    responseStatus?: number
    errorMessage?: string
}

export async function withMiddleware(
    handler: (request: NextRequest, context: EndpointContext) => Promise<NextResponse>,
    entity: AuditEntity,
    rateLimitConfig?: { interval: number; maxRequests: number }
) {
    return async (request: NextRequest) => {
        const correlationId = generateCorrelationId()
        const clientIp = getClientIp(request)
        const { userId } = verifyTokenFromCookie(request)
        const endpoint = new URL(request.url).pathname
        const method = request.method

        const headers = new Headers(rateLimitHeaders(rateLimit('ip:' + clientIp, rateLimitConfig)))
        headers.set('X-Correlation-ID', correlationId)

        const rateLimitResponse = getRateLimitResponse({
            clientIp,
            userId,
            headers,
            correlationId,
            rateLimitConfig,
        })
        if (rateLimitResponse) {
            return rateLimitResponse
        }

        const context: EndpointContext = {
            correlationId,
            clientIp,
            userId: userId || undefined,
            method,
            endpoint,
            entity,
        }

        try {
            const response = await handler(request, context)

            await safeCreateAuditLog({
                userId,
                method,
                entity,
                endpoint,
                clientIp,
                userAgent: request.headers.get('user-agent') || undefined,
                correlationId,
                status: 'SUCCESS',
                responseStatus: response.status,
            })

            applyHeaders(response, headers)
            return response
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)

            console.error('[Endpoint] Handler error:', {
                error: errorMessage,
                correlationId,
                endpoint,
                method,
                userId: userId?.toString(),
            })

            captureException(error, {
                correlationId,
                endpoint,
                method,
                userId: userId?.toString(),
            })

            await safeCreateAuditLog({
                userId,
                method,
                entity,
                endpoint,
                clientIp,
                userAgent: request.headers.get('user-agent') || undefined,
                correlationId,
                status: 'FAILURE',
                errorMessage,
            })

            return NextResponse.json(
                {
                    success: false,
                    error: 'Internal server error',
                    errorCode: ErrorCode.INTERNAL_ERROR,
                    correlationId,
                },
                { status: 500, headers }
            )
        }
    }
}

function getRateLimitResponse(params: {
    clientIp: string
    userId: bigint | null
    headers: Headers
    correlationId: string
    rateLimitConfig?: { interval: number; maxRequests: number }
}): NextResponse | null {
    const ipLimit = rateLimit('ip:' + params.clientIp, params.rateLimitConfig)
    if (!ipLimit.success) {
        return NextResponse.json(
            {
                success: false,
                error: 'Rate limit exceeded',
                errorCode: ErrorCode.RATE_LIMITED,
                correlationId: params.correlationId,
            },
            { status: 429, headers: params.headers }
        )
    }

    if (!params.userId) {
        return null
    }

    const userLimit = rateLimit('user:' + params.userId.toString(), {
        interval: 60000,
        maxRequests: 500,
    })

    if (!userLimit.success) {
        return NextResponse.json(
            {
                success: false,
                error: 'Rate limit exceeded',
                errorCode: ErrorCode.RATE_LIMITED,
                correlationId: params.correlationId,
            },
            { status: 429, headers: params.headers }
        )
    }

    return null
}

function isMutationMethod(method: string): boolean {
    return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE'
}

async function safeCreateAuditLog(input: AuditEventInput): Promise<void> {
    if (!isMutationMethod(input.method) || !input.userId) {
        return
    }

    const entityId = extractIdFromUrl(input.endpoint)
    if (entityId === null) {
        return
    }

    const metadata = {
        correlationId: input.correlationId,
        ipAddress: input.clientIp,
        ...(input.userAgent ? { userAgent: input.userAgent } : {}),
        ...(typeof input.responseStatus === 'number'
            ? { statusCode: input.responseStatus }
            : {}),
    }

    if (input.userAgent) {
        metadata.userAgent = input.userAgent
    }
    if (typeof input.responseStatus === 'number') {
        metadata.statusCode = input.responseStatus
    }

    try {
        await createAuditLog({
            userId: input.userId,
            action: getAuditAction(input.method),
            entity: input.entity,
            entityId,
            status: input.status,
            errorMessage: input.errorMessage,
            metadata,
        })
    } catch (auditError) {
        console.error('[Endpoint] Failed to create audit log:', auditError, {
            correlationId: input.correlationId,
            endpoint: input.endpoint,
            status: input.status,
        })
    }
}

function applyHeaders(response: NextResponse, headers: Headers): void {
    headers.forEach((value, key) => {
        response.headers.set(key, value)
    })
}

function getAuditAction(method: string): AuditAction {
    if (method === 'POST') return AuditAction.CREATE
    if (method === 'DELETE') return AuditAction.DELETE
    return AuditAction.UPDATE
}

function extractIdFromUrl(url: string): bigint | null {
    const regex = /\/(\d+)(?:\/|$)/
    const match = regex.exec(url)
    return match?.[1] ? BigInt(match[1]) : null
}