import prisma from '@/lib/prisma'

export class CardRepository {
    async getCardsByListId(listId: bigint) {
        return prisma.card.findMany({
            where: { listId },
            select: {
                id: true,
                title: true,
                description: true,
                position: true,
                listId: true,
                assigneeUserId: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        })
    }

    async getCardById(cardId: bigint) {
        return prisma.card.findUnique({
            where: { id: cardId },
            select: {
                id: true,
                title: true,
                description: true,
                position: true,
                listId: true,
                assigneeUserId: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
                list: {
                    select: { id: true, boardId: true },
                },
                assignee: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
                creator: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        })
    }

    async createCard(
        listId: bigint,
        userId: bigint,
        data: {
            title: string
            description?: string
            position: number
            assigneeUserId?: bigint
        }
    ) {
        return prisma.card.create({
            data: {
                listId,
                title: data.title,
                description: data.description,
                position: data.position,
                createdBy: userId,
                assigneeUserId: data.assigneeUserId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                position: true,
                listId: true,
                assigneeUserId: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async updateCard(
        cardId: bigint,
        data: {
            title?: string
            description?: string
            assigneeUserId?: bigint
        }
    ) {
        return prisma.card.update({
            where: { id: cardId },
            data,
            select: {
                id: true,
                title: true,
                description: true,
                position: true,
                listId: true,
                assigneeUserId: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async moveCard(
        cardId: bigint,
        data: {
            listId: bigint
            position: number
        }
    ) {
        return prisma.card.update({
            where: { id: cardId },
            data,
            select: {
                id: true,
                title: true,
                description: true,
                position: true,
                listId: true,
                assigneeUserId: true,
                createdBy: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async deleteCard(cardId: bigint) {
        return prisma.card.delete({
            where: { id: cardId },
            select: { id: true },
        })
    }
}