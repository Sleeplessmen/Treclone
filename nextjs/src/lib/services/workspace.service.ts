import { WorkspaceRepository } from '@/lib/repositories/workspace.repository'
import { createWorkspaceSchema, updateWorkspaceSchema } from '@/lib/validation/workspace'
import { AuthError, AuthErrorCode } from '@/lib/utils/error-handler'

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
                throw new AuthError(
                    'Workspace not found',
                    404,
                    AuthErrorCode.USER_NOT_FOUND
                )
            }

            // Verify user is owner
            if (workspace.ownerId !== userId) {
                throw new AuthError(
                    'Forbidden - not the workspace owner',
                    403,
                    AuthErrorCode.INVALID_CREDENTIALS
                )
            }

            return workspace
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to fetch workspace',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }

    async createWorkspace(userId: bigint, credentials: unknown) {
        try {
            const validatedData = createWorkspaceSchema.parse(credentials)

            const workspace = await this.repository.createWorkspace(userId, {
                name: validatedData.name,
                description: validatedData.description,
            })

            return workspace
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to create workspace',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }

    async updateWorkspace(workspaceId: bigint, userId: bigint, credentials: unknown) {
        try {
            // Verify ownership first
            const workspace = await this.repository.getWorkspaceById(workspaceId)

            if (!workspace) {
                throw new AuthError(
                    'Workspace not found',
                    404,
                    AuthErrorCode.USER_NOT_FOUND
                )
            }

            if (workspace.ownerId !== userId) {
                throw new AuthError(
                    'Forbidden - not the workspace owner',
                    403,
                    AuthErrorCode.INVALID_CREDENTIALS
                )
            }

            // Validate input
            const validatedData = updateWorkspaceSchema.parse(credentials)

            const updateData: any = {}

            if (validatedData.name) {
                updateData.name = validatedData.name
            }

            if (validatedData.description !== undefined) {
                updateData.description = validatedData.description
            }

            const updated = await this.repository.updateWorkspace(workspaceId, updateData)
            return updated
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to update workspace',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }

    async deleteWorkspace(workspaceId: bigint, userId: bigint) {
        try {
            // Verify ownership first
            const workspace = await this.repository.getWorkspaceById(workspaceId)

            if (!workspace) {
                throw new AuthError(
                    'Workspace not found',
                    404,
                    AuthErrorCode.USER_NOT_FOUND
                )
            }

            if (workspace.ownerId !== userId) {
                throw new AuthError(
                    'Forbidden - not the workspace owner',
                    403,
                    AuthErrorCode.INVALID_CREDENTIALS
                )
            }

            await this.repository.deleteWorkspace(workspaceId)
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to delete workspace',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }
}