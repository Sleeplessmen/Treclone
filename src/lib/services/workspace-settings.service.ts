import { WorkspaceSettingsRepository } from '@/lib/repositories/workspace-settings.repository'
import { updateWorkspaceSettingsSchema } from '@/lib/validation/workspace-settings'
import { AppError, ErrorCode } from '@/lib/utils/errors'

export class WorkspaceSettingsService {
    private readonly repository = new WorkspaceSettingsRepository()

    async getSettings(workspaceId: bigint, userId: bigint) {
        try {
            // Verify workspace exists and user is owner
            const workspace = await this.repository.getWorkspace(workspaceId)

            if (!workspace) {
                throw new AppError('Workspace not found', 404, ErrorCode.WORKSPACE_NOT_FOUND)
            }

            if (workspace.ownerId !== userId) {
                throw new AppError(
                    'Forbidden - not the workspace owner',
                    403,
                    ErrorCode.FORBIDDEN
                )
            }

            return {
                id: workspace.id,
                visibility: workspace.visibility,
                notifications: {
                    dailySummary: workspace.dailySummary,
                    mentionAlerts: workspace.mentionAlerts,
                },
            }
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to fetch workspace settings',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async updateSettings(workspaceId: bigint, userId: bigint, credentials: unknown) {
        try {
            // Verify workspace exists and user is owner
            const workspace = await this.repository.getWorkspace(workspaceId)

            if (!workspace) {
                throw new AppError('Workspace not found', 404, ErrorCode.WORKSPACE_NOT_FOUND)
            }

            if (workspace.ownerId !== userId) {
                throw new AppError(
                    'Forbidden - not the workspace owner',
                    403,
                    ErrorCode.FORBIDDEN
                )
            }

            // Validate input
            const validatedData = updateWorkspaceSettingsSchema.parse(credentials)

            const updateData: any = {}

            if (validatedData.visibility) {
                updateData.visibility = validatedData.visibility
            }

            if (validatedData.notifications) {
                if (validatedData.notifications.dailySummary !== undefined) {
                    updateData.dailySummary = validatedData.notifications.dailySummary
                }
                if (validatedData.notifications.mentionAlerts !== undefined) {
                    updateData.mentionAlerts = validatedData.notifications.mentionAlerts
                }
            }

            const updated = await this.repository.updateSettings(workspaceId, updateData)

            return {
                id: updated.id,
                visibility: updated.visibility,
                notifications: {
                    dailySummary: updated.dailySummary,
                    mentionAlerts: updated.mentionAlerts,
                },
            }
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to update workspace settings',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async deleteWorkspace(workspaceId: bigint, userId: bigint) {
        try {
            // Verify workspace exists and user is owner
            const workspace = await this.repository.getWorkspace(workspaceId)

            if (!workspace) {
                throw new AppError('Workspace not found', 404, ErrorCode.WORKSPACE_NOT_FOUND)
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
