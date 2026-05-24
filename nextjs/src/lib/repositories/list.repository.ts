import prisma from '@/lib/db/prisma'

export class ListRepository {
    async getListsByBoardId(boardId: bigint) {
        return prisma.list.findMany({
            where: { boardId },
            select: {
                id: true,
                title: true,
                position: true,
                boardId: true,
                createdAt: true,
                updatedAt: true,
                cards: {
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
                    },
                    orderBy: { position: 'asc' },
                },
                _count: {
                    select: { cards: true },
                },
            },
            orderBy: { position: 'asc' },
        })
    }

    async getListById(listId: bigint) {
        return prisma.list.findUnique({
            where: { id: listId },
            select: {
                id: true,
                title: true,
                position: true,
                boardId: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async createList(
        boardId: bigint,
        data: {
            title: string
            position: number
        }
    ) {
        return prisma.list.create({
            data: {
                boardId,
                title: data.title,
                position: data.position,
            },
            select: {
                id: true,
                title: true,
                position: true,
                boardId: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async updateList(
        listId: bigint,
        data: {
            title?: string
            position?: number
        }
    ) {
        return prisma.list.update({
            where: { id: listId },
            data,
            select: {
                id: true,
                title: true,
                position: true,
                boardId: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async moveList(listId: bigint, boardId: bigint, position: number) {
        return prisma.$transaction(async (tx) => {
            const lists = await tx.list.findMany({
                where: { boardId },
                orderBy: { position: 'asc' },
                select: { id: true },
            })

            const reorderedLists = lists.filter((list) => list.id !== listId)
            const targetPosition = Math.min(position, reorderedLists.length)
            reorderedLists.splice(targetPosition, 0, { id: listId })

            for (const [index, list] of reorderedLists.entries()) {
                await tx.list.update({
                    where: { id: list.id },
                    data: { position: -1000000 - index },
                })
            }

            for (const [index, list] of reorderedLists.entries()) {
                await tx.list.update({
                    where: { id: list.id },
                    data: { position: index },
                })
            }

            return tx.list.findUniqueOrThrow({
                where: { id: listId },
                select: {
                    id: true,
                    title: true,
                    position: true,
                    boardId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
        })
    }

    async deleteList(listId: bigint) {
        return prisma.list.delete({
            where: { id: listId },
            select: { id: true },
        })
    }
}
