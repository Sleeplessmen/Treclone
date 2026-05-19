import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, convertBigIntToString } from '@/lib/api-utils'
import { ListService } from '@/lib/services/list.service'
import { handleAuthError } from '@/lib/utils/error-handler'

export class ListController {
    private readonly service = new ListService()

    async getLists(request: NextRequest, boardId: bigint, userId: bigint) {
        try {
            const lists = await this.service.getListsByBoardId(boardId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Lists fetched successfully',
                    lists: convertBigIntToString(lists),
                })
            )
        } catch (error) {
            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }

    async createList(request: NextRequest, boardId: bigint, userId: bigint) {
        try {
            const body = await request.json()
            const list = await this.service.createList(boardId, userId, body)

            return NextResponse.json(
                successResponse(
                    {
                        message: 'List created successfully',
                        list: convertBigIntToString(list),
                    }
                ),
                { status: 201 }
            )
        } catch (error) {
            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }

    async getList(request: NextRequest, listId: bigint, userId: bigint) {
        try {
            const list = await this.service.getListById(listId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'List fetched successfully',
                    list: convertBigIntToString(list),
                })
            )
        } catch (error) {
            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }

    async updateList(request: NextRequest, listId: bigint, userId: bigint) {
        try {
            const body = await request.json()
            const list = await this.service.updateList(listId, userId, body)

            return NextResponse.json(
                successResponse({
                    message: 'List updated successfully',
                    list: convertBigIntToString(list),
                })
            )
        } catch (error) {
            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }

    async deleteList(request: NextRequest, listId: bigint, userId: bigint) {
        try {
            await this.service.deleteList(listId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'List deleted successfully',
                })
            )
        } catch (error) {
            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }
}