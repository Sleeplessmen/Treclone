import prisma from '@/lib/db/prisma'
import type { Prisma } from '../../../prisma/generated/client/client'

interface CreateAuditLogParams {
    userId: bigint
    action: string
    entity: string
    entityId: bigint
    workspaceId?: bigint
    changes?: Prisma.JsonValue
    status: 'SUCCESS' | 'FAILURE'
    errorMessage?: string
    metadata?: Prisma.JsonValue
}

export async function createAuditLog({
    userId,
    action,
    entity,
    entityId,
    workspaceId,
    changes,
    status,
    errorMessage,
    metadata,
}: CreateAuditLogParams) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                workspaceId,
                changes: changes ? JSON.stringify(changes) : null,
                status,
                errorMessage: errorMessage || null,
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        })
    } catch (error) {
        console.error('Failed to create audit log:', error)
        // Don't throw - audit logging should not break the main operation
    }
}