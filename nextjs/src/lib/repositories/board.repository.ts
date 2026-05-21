import prisma from '@/lib/prisma'

export class BoardRepository {
    async getBoardsByWorkspaceId(workspaceId: bigint) {
        const boards = await prisma.board.findMany({
            where: { workspaceId },
            select: {
                id: true,
                title: true,
                description: true,
                ownerId: true,
                workspaceId: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { lists: true },
                },
                lists: {
                    select: {
                        _count: {
                            select: { cards: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return boards.map(({ lists, _count, ...board }) => ({
            ...board,
            _count: {
                ..._count,
                cards: lists.reduce(
                    (total, list) => total + list._count.cards,
                    0
                ),
            },
        }))
    }

    async getBoardById(boardId: bigint) {
        return prisma.board.findUnique({
            where: { id: boardId },
            select: {
                id: true,
                title: true,
                description: true,
                ownerId: true,
                workspaceId: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { lists: true, boardMembers: true },
                },
            },
        })
    }

    async createBoard(
        workspaceId: bigint,
        userId: bigint,
        data: {
            title: string
            description?: string
        }
    ) {
        return prisma.board.create({
            data: {
                title: data.title,
                description: data.description,
                ownerId: userId,
                workspaceId: workspaceId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                ownerId: true,
                workspaceId: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async updateBoard(
        boardId: bigint,
        data: {
            title?: string
            description?: string
        }
    ) {
        return prisma.board.update({
            where: { id: boardId },
            data,
            select: {
                id: true,
                title: true,
                description: true,
                ownerId: true,
                workspaceId: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async deleteBoard(boardId: bigint) {
        return prisma.board.delete({
            where: { id: boardId },
            select: { id: true },
        })
    }
}
