import { ListRepository } from '@/lib/repositories/list.repository'
import { createListSchema, updateListSchema } from '@/lib/validation/list'
import { AppError, ErrorCode } from '@/lib/utils/errors'
import prisma from '@/lib/db/prisma'

export class ListService {
    private readonly repository = new ListRepository()

    private async assertBoardAccess(boardId: bigint, userId: bigint) {
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            select: { id: true, ownerId: true, workspaceId: true },
        })

        if (!board) {
            throw new AppError(
                'Board not found',
                404,
                ErrorCode.USER_NOT_FOUND
            )
        }

        const member = board.workspaceId
            ? await prisma.workspaceMember.findFirst({
                where: { workspaceId: board.workspaceId, userId },
                select: { id: true },
            })
            : null

        if (board.ownerId !== userId && !member) {
            throw new AppError(
                'Forbidden - you do not have access to this board',
                403,
                ErrorCode.FORBIDDEN
            )
        }

        return board
    }

    async getListsByBoardId(boardId: bigint, userId: bigint) {
        try {
            await this.assertBoardAccess(boardId, userId)

            const lists = await this.repository.getListsByBoardId(boardId)
            return lists
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to fetch lists',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async getListById(listId: bigint, userId: bigint) {
        try {
            const list = await this.repository.getListById(listId)

            if (!list) {
                throw new AppError('List not found', 404, ErrorCode.USER_NOT_FOUND)
            }

            await this.assertBoardAccess(list.boardId, userId)

            return list
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to fetch list',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async createList(boardId: bigint, userId: bigint, credentials: unknown) {
        try {
            await this.assertBoardAccess(boardId, userId)

            const validatedData = createListSchema.parse(credentials)
            const title = validatedData.title.trim()

            const existingList = await prisma.list.findFirst({
                where: {
                    boardId,
                    title,
                },
                select: { id: true },
            })

            if (existingList) {
                throw new AppError(
                    'List title already exists in this board',
                    409,
                    ErrorCode.VALIDATION_ERROR
                )
            }

            let position = validatedData.position
            if (position === undefined) {
                const lastList = await prisma.list.findFirst({
                    where: { boardId },
                    orderBy: { position: 'desc' },
                    select: { position: true },
                })
                position = (lastList?.position ?? -1) + 1
            }

            const list = await this.repository.createList(boardId, {
                title,
                position,
            })

            return list
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to create list',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async updateList(listId: bigint, userId: bigint, credentials: unknown) {
        try {
            const list = await this.repository.getListById(listId)

            if (!list) {
                throw new AppError('List not found', 404, ErrorCode.USER_NOT_FOUND)
            }

            await this.assertBoardAccess(list.boardId, userId)

            const validatedData = updateListSchema.parse(credentials)

            const updateData: {
                title?: string
                position?: number
            } = {}

            if (validatedData.title !== undefined) {
                const nextTitle = validatedData.title.trim()

                const existingList = await prisma.list.findFirst({
                    where: {
                        boardId: list.boardId,
                        title: nextTitle,
                        id: { not: listId },
                    },
                    select: { id: true },
                })

                if (existingList) {
                    throw new AppError(
                        'List title already exists in this board',
                        409,
                        ErrorCode.VALIDATION_ERROR
                    )
                }

                updateData.title = nextTitle
            }

            let updated = list

            if (Object.keys(updateData).length > 0) {
                updated = await this.repository.updateList(listId, updateData)
            }

            if (validatedData.position !== undefined) {
                updated = await this.repository.moveList(
                    listId,
                    list.boardId,
                    validatedData.position
                )
            }

            return updated
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to update list',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async deleteList(listId: bigint, userId: bigint) {
        try {
            const list = await this.repository.getListById(listId)

            if (!list) {
                throw new AppError('List not found', 404, ErrorCode.USER_NOT_FOUND)
            }

            await this.assertBoardAccess(list.boardId, userId)

            await this.repository.deleteList(listId)
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to delete list',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }
}
