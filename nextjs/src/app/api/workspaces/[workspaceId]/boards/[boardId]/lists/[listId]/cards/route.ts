import { NextRequest } from 'next/server'
import { CardController } from '@/lib/controllers/card.controller'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import { errorResponse } from '@/lib/api-utils'

const controller = new CardController()

export async function GET(
    request: NextRequest,
    { params }: { params: { listId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const listId = BigInt(params.listId)
    return controller.getCards(request, listId, userId)
}

export async function POST(
    request: NextRequest,
    { params }: { params: { listId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const listId = BigInt(params.listId)
    return controller.createCard(request, listId, userId)
}