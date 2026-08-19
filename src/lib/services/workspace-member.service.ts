import prisma from '@/lib/db/prisma'
import {
    addWorkspaceMemberSchema,
    updateWorkspaceMemberSchema,
} from '@/lib/validation/workspace-membership'
import { WorkspaceMemberRepository } from '@/lib/repositories/workspace-member.repository'
import { AppError, ErrorCode } from '@/lib/utils/errors'

export class WorkspaceMemberService {
    private readonly repository = new WorkspaceMemberRepository()

    async getMembers(workspaceId: bigint, userId: bigint) {
        try {
            const workspace = await prisma.workspace.findUnique({
                where: { id: workspaceId },
                select: { id: true, ownerId: true },
            })

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

            return this.repository.getWorkspaceMembers(workspaceId)
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to fetch members',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async addMember(workspaceId: bigint, userId: bigint, credentials: unknown) {
        try {
            const workspace = await prisma.workspace.findUnique({
                where: { id: workspaceId },
                select: { id: true, ownerId: true },
            })

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
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            const validatedData = addWorkspaceMemberSchema.parse(credentials)
            const targetUser = await this.repository.getUserByEmail(
                validatedData.email
            )

            if (!targetUser) {
                throw new AppError(
                    'User with this email not found',
                    404,
                    ErrorCode.USER_NOT_FOUND
                )
            }

            const existingMember = await this.repository.checkExistingMember(
                workspaceId,
                targetUser.id
            )

            if (existingMember) {
                throw new AppError(
                    'User is already a member of this workspace',
                    409,
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            return this.repository.addMember(
                workspaceId,
                targetUser.id,
                validatedData.role
            )
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to add member',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async updateMemberRole(
        workspaceId: bigint,
        memberId: bigint,
        userId: bigint,
        credentials: unknown
    ) {
        try {
            const workspace = await prisma.workspace.findUnique({
                where: { id: workspaceId },
                select: { id: true, ownerId: true },
            })

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
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            const validatedData = updateWorkspaceMemberSchema.parse(credentials)
            const member = await this.repository.getMemberById(memberId)

            if (member?.workspaceId !== workspaceId) {
                throw new AppError(
                    'Member not found in this workspace',
                    404,
                    ErrorCode.USER_NOT_FOUND
                )
            }

            if (member.userId === workspace.ownerId) {
                throw new AppError(
                    'Cannot update the workspace owner',
                    403,
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            return this.repository.updateMemberRole(memberId, validatedData.role)
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to update member',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async removeMemberById(
        workspaceId: bigint,
        memberId: bigint,
        userId: bigint
    ) {
        try {
            const workspace = await prisma.workspace.findUnique({
                where: { id: workspaceId },
                select: { id: true, ownerId: true },
            })

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
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            const member = await this.repository.getMemberById(memberId)

            if (member?.workspaceId !== workspaceId) {
                throw new AppError(
                    'Member not found in this workspace',
                    404,
                    ErrorCode.USER_NOT_FOUND
                )
            }

            if (member.userId === workspace.ownerId) {
                throw new AppError(
                    'Cannot remove the workspace owner',
                    403,
                    ErrorCode.INVALID_CREDENTIALS
                )
            }

            await this.repository.removeMember(memberId)
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to remove member',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }
}
