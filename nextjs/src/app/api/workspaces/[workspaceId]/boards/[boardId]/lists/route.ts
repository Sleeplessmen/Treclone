import { NextRequest } from 'next/server'
import { ListController } from '@/lib/controllers/list.controller'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import { errorResponse } from '@/lib/api-utils'

const controller = new ListController()

export async function GET(
    request: NextRequest,
    { params }: { params: { boardId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const boardId = BigInt(params.boardId)
    return controller.getLists(request, boardId, userId)
}

export async function POST(
    request: NextRequest,
    { params }: { params: { boardId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const boardId = BigInt(params.boardId)
    return controller.createList(request, boardId, userId)
}