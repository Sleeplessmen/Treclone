import { NextRequest } from 'next/server'
import { CardController } from '@/lib/controllers/card.controller'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import { errorResponse } from '@/lib/api-utils'

const controller = new CardController()

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cardId: string }> }
) {
    const { cardId } = await params
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    return controller.getCard(request, BigInt(cardId), userId)
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ cardId: string }> }
) {
    const { cardId } = await params
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    return controller.updateCard(request, BigInt(cardId), userId)
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ cardId: string }> }
) {
    const { cardId } = await params
    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return errorResponse('Unauthorized', 401)
    }

    return controller.deleteCard(request, BigInt(cardId), userId)
}