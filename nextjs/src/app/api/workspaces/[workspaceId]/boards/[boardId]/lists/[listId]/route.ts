import { NextRequest } from 'next/server'
import { ListController } from '@/lib/controllers/list.controller'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import { errorResponse } from '@/lib/api-utils'

const controller = new ListController()

export async function GET(
    request: NextRequest,
    { params }: { params: { listId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const listId = BigInt(params.listId)
    return controller.getList(request, listId, userId)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { listId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const listId = BigInt(params.listId)
    return controller.updateList(request, listId, userId)
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { listId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const listId = BigInt(params.listId)
    return controller.deleteList(request, listId, userId)
}