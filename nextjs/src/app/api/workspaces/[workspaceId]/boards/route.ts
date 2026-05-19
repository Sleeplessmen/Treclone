import { NextRequest } from 'next/server'
import { BoardController } from '@/lib/controllers/board.controller'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import { errorResponse } from '@/lib/api-utils'

const controller = new BoardController()

export async function GET(
    request: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const workspaceId = BigInt(params.workspaceId)
    return controller.getBoards(request, workspaceId, userId)
}

export async function POST(
    request: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const workspaceId = BigInt(params.workspaceId)
    return controller.createBoard(request, workspaceId, userId)
}