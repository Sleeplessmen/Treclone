import { WorkspaceRepository } from '@/lib/repositories/workspace.repository'
import { createWorkspaceSchema, updateWorkspaceSchema } from '@/lib/validation/workspace'
import { AppError, ErrorCode } from '@/lib/utils/errors'
import prisma from '@/lib/db/prisma'

export class WorkspaceService {
    private readonly repository = new WorkspaceRepository()

    async getWorkspacesByUserId(userId: bigint) {
        const workspaces = await this.repository.getWorkspacesByUserId(userId)
        return workspaces
    }

    async getWorkspaceById(workspaceId: bigint, userId: bigint) {
        try {
            const workspace = await this.repository.getWorkspaceById(workspaceId)

            if (!workspace) {
                throw new AppError(
                    'Workspace not found',
                    404,
                    ErrorCode.USER_NOT_FOUND
                )
            }

            const member = await prisma.workspaceMember.findFirst({
                where: { workspaceId, userId },
                select: { id: true },
            })

            if (workspace.ownerId !== userId && !member) {
                throw new AppError(
                    'Forbidden - you do not have access to this workspace',
                    403,
                    ErrorCode.FORBIDDEN
                )
            }

            return workspace
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to fetch workspace',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async createWorkspace(userId: bigint, credentials: unknown) {
        try {
            const validatedData = createWorkspaceSchema.parse(credentials)
            const name = validatedData.name.trim()

            const existingWorkspace = await prisma.workspace.findFirst({
                where: {
                    ownerId: userId,
                    name,
                },
                select: { id: true },
            })

            if (existingWorkspace) {
                throw new AppError(
                    'Workspace name already exists',
                    409,
                    ErrorCode.VALIDATION_ERROR
                )
            }

            const workspace = await this.repository.createWorkspace(userId, {
                name,
                description: validatedData.description,
            })

            return workspace
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to create workspace',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async updateWorkspace(workspaceId: bigint, userId: bigint, credentials: unknown) {
        try {
            const workspace = await this.repository.getWorkspaceById(workspaceId)

            if (!workspace) {
                throw new AppError(
                    'Workspace not found',
                    404,
                    ErrorCode.USER_NOT_FOUND
                )
            }

            if (workspace.ownerId !== userId) {
                throw new AppError(
                    'Forbidden - not the workspace owner',
                    403,
                    ErrorCode.FORBIDDEN
                )
            }

            const validatedData = updateWorkspaceSchema.parse(credentials)

            const updateData: {
                name?: string
                description?: string
            } = {}

            if (validatedData.name !== undefined) {
                const nextName = validatedData.name.trim()

                const existingWorkspace = await prisma.workspace.findFirst({
                    where: {
                        ownerId: userId,
                        name: nextName,
                        id: { not: workspaceId },
                    },
                    select: { id: true },
                })

                if (existingWorkspace) {
                    throw new AppError(
                        'Workspace name already exists',
                        409,
                        ErrorCode.VALIDATION_ERROR
                    )
                }

                updateData.name = nextName
            }

            if (validatedData.description !== undefined) {
                updateData.description = validatedData.description
            }

            const updated = await this.repository.updateWorkspace(workspaceId, updateData)
            return updated
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to update workspace',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async deleteWorkspace(workspaceId: bigint, userId: bigint) {
        try {
            const workspace = await this.repository.getWorkspaceById(workspaceId)

            if (!workspace) {
                throw new AppError(
                    'Workspace not found',
                    404,
                    ErrorCode.USER_NOT_FOUND
                )
            }

            if (workspace.ownerId !== userId) {
                throw new AppError(
                    'Forbidden - not the workspace owner',
                    403,
                    ErrorCode.FORBIDDEN
                )
            }

            await this.repository.deleteWorkspace(workspaceId)
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to delete workspace',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }
}
