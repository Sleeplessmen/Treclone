import prisma from '@/lib/db/prisma'
import {
    addWorkspaceMemberSchema,
    updateWorkspaceMemberSchema,
} from '@/lib/validation/workspace-membership'
import { WorkspaceMemberRepository } from '@/lib/repositories/workspace-member.repository'
import { AuthError, AuthErrorCode } from '@/lib/utils/error-handler'

export class WorkspaceMemberService {
    private readonly repository = new WorkspaceMemberRepository()

    async getMembers(workspaceId: bigint, userId: bigint) {
        try {
            const workspace = await prisma.workspace.findUnique({
                where: { id: workspaceId },
                select: { id: true, ownerId: true },
            })

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

            return this.repository.getWorkspaceMembers(workspaceId)
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to fetch members',
                500,
                AuthErrorCode.INTERNAL_ERROR
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

            const validatedData = addWorkspaceMemberSchema.parse(credentials)
            const targetUser = await this.repository.getUserByEmail(
                validatedData.email
            )

            if (!targetUser) {
                throw new AuthError(
                    'User with this email not found',
                    404,
                    AuthErrorCode.USER_NOT_FOUND
                )
            }

            const existingMember = await this.repository.checkExistingMember(
                workspaceId,
                targetUser.id
            )

            if (existingMember) {
                throw new AuthError(
                    'User is already a member of this workspace',
                    409,
                    AuthErrorCode.INVALID_CREDENTIALS
                )
            }

            return this.repository.addMember(
                workspaceId,
                targetUser.id,
                validatedData.role
            )
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to add member',
                500,
                AuthErrorCode.INTERNAL_ERROR
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

            const validatedData = updateWorkspaceMemberSchema.parse(credentials)
            const member = await this.repository.getMemberById(memberId)

            if (member?.workspaceId !== workspaceId) {
                throw new AuthError(
                    'Member not found in this workspace',
                    404,
                    AuthErrorCode.USER_NOT_FOUND
                )
            }

            if (member.userId === workspace.ownerId) {
                throw new AuthError(
                    'Cannot update the workspace owner',
                    403,
                    AuthErrorCode.INVALID_CREDENTIALS
                )
            }

            return this.repository.updateMemberRole(memberId, validatedData.role)
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to update member',
                500,
                AuthErrorCode.INTERNAL_ERROR
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

            const member = await this.repository.getMemberById(memberId)

            if (member?.workspaceId !== workspaceId) {
                throw new AuthError(
                    'Member not found in this workspace',
                    404,
                    AuthErrorCode.USER_NOT_FOUND
                )
            }

            if (member.userId === workspace.ownerId) {
                throw new AuthError(
                    'Cannot remove the workspace owner',
                    403,
                    AuthErrorCode.INVALID_CREDENTIALS
                )
            }

            await this.repository.removeMember(memberId)
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to remove member',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }
}