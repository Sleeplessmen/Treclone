import prisma from '@/lib/db/prisma'
import { CardCommentRepository } from '@/lib/repositories/card-comment.repository'
import { createCardCommentSchema } from '@/lib/validation/card-comment'
import { AuthError, AuthErrorCode } from '@/lib/utils/error-handler'

export class CardCommentService {
    private readonly repository = new CardCommentRepository()

    private async assertCardAccess(cardId: bigint, userId: bigint) {
        const card = await prisma.card.findUnique({
            where: { id: cardId },
            select: {
                id: true,
                title: true,
                list: {
                    select: {
                        board: {
                            select: {
                                id: true,
                                ownerId: true,
                                workspaceId: true,
                            },
                        },
                    },
                },
            },
        })

        if (!card) {
            throw new AuthError('Card not found', 404, AuthErrorCode.USER_NOT_FOUND)
        }

        const board = card.list.board
        const member = board.workspaceId
            ? await prisma.workspaceMember.findFirst({
                where: { workspaceId: board.workspaceId, userId },
                select: { id: true },
            })
            : null

        if (board.ownerId !== userId && !member) {
            throw new AuthError(
                'Forbidden - you do not have access to this card',
                403,
                AuthErrorCode.FORBIDDEN
            )
        }

        return { card, board }
    }

    async getCommentsByCardId(cardId: bigint, userId: bigint) {
        try {
            await this.assertCardAccess(cardId, userId)
            return this.repository.getCommentsByCardId(cardId)
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to fetch card comments',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }

    async createComment(cardId: bigint, userId: bigint, credentials: unknown) {
        try {
            await this.assertCardAccess(cardId, userId)
            const validatedData = createCardCommentSchema.parse(credentials)
            return this.repository.createComment(cardId, userId, validatedData.content)
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to create card comment',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }

    async getCardWorkspaceId(cardId: bigint) {
        const card = await prisma.card.findUnique({
            where: { id: cardId },
            select: {
                list: {
                    select: {
                        board: {
                            select: { workspaceId: true },
                        },
                    },
                },
            },
        })

        return card?.list.board.workspaceId ?? null
    }
}
