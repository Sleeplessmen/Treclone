import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, convertBigIntToString } from '@/lib/api-utils'
import { BoardService } from '@/lib/services/board.service'
import { handleAuthError } from '@/lib/utils/error-handler'

export class BoardController {
    private readonly service = new BoardService()

    async getBoards(
        request: NextRequest,
        workspaceId: bigint,
        userId: bigint
    ) {
        try {
            const boards = await this.service.getBoardsByWorkspaceId(workspaceId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Boards fetched successfully',
                    boards: convertBigIntToString(boards),
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

    async createBoard(
        request: NextRequest,
        workspaceId: bigint,
        userId: bigint
    ) {
        try {
            const body = await request.json()
            const board = await this.service.createBoard(workspaceId, userId, body)

            return NextResponse.json(
                successResponse(
                    {
                        message: 'Board created successfully',
                        board: convertBigIntToString(board),
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

    async getBoard(request: NextRequest, boardId: bigint, userId: bigint) {
        try {
            const board = await this.service.getBoardById(boardId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Board fetched successfully',
                    board: convertBigIntToString(board),
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

    async updateBoard(request: NextRequest, boardId: bigint, userId: bigint) {
        try {
            const body = await request.json()
            const board = await this.service.updateBoard(boardId, userId, body)

            return NextResponse.json(
                successResponse({
                    message: 'Board updated successfully',
                    board: convertBigIntToString(board),
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

    async deleteBoard(request: NextRequest, boardId: bigint, userId: bigint) {
        try {
            await this.service.deleteBoard(boardId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Board deleted successfully',
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