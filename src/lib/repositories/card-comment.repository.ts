import prisma from '@/lib/db/prisma'

export class CardCommentRepository {
    async getCommentsByCardId(cardId: bigint) {
        return prisma.cardComment.findMany({
            where: { cardId },
            select: {
                id: true,
                cardId: true,
                userId: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        })
    }

    async createComment(cardId: bigint, userId: bigint, content: string) {
        return prisma.cardComment.create({
            data: {
                cardId,
                userId,
                content,
            },
            select: {
                id: true,
                cardId: true,
                userId: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        })
    }
}
