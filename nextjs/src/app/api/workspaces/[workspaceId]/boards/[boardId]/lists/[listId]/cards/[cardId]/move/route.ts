import { NextRequest } from 'next/server'
import { CardController } from '@/lib/controllers/card.controller'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import { errorResponse } from '@/lib/api-utils'

const controller = new CardController()

export async function PATCH(
    request: NextRequest,
    { params }: { params: { cardId: string } }
) {
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    const cardId = BigInt(params.cardId)
    return controller.moveCard(request, cardId, userId)
}