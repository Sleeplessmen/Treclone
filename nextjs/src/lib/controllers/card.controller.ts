import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, convertBigIntToString } from '@/lib/api-utils'
import { CardService } from '@/lib/services/card.service'
import { handleAuthError } from '@/lib/utils/error-handler'

export class CardController {
    private readonly service = new CardService()

    async getCards(request: NextRequest, listId: bigint, userId: bigint) {
        try {
            const cards = await this.service.getCardsByListId(listId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Cards fetched successfully',
                    cards: convertBigIntToString(cards),
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

    async createCard(request: NextRequest, listId: bigint, userId: bigint) {
        try {
            const body = await request.json()
            const card = await this.service.createCard(listId, userId, body)

            return NextResponse.json(
                successResponse(
                    {
                        message: 'Card created successfully',
                        card: convertBigIntToString(card),
                    },
                    201
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

    async getCard(request: NextRequest, cardId: bigint, userId: bigint) {
        try {
            const card = await this.service.getCardById(cardId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Card fetched successfully',
                    card: convertBigIntToString(card),
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

    async updateCard(request: NextRequest, cardId: bigint, userId: bigint) {
        try {
            const body = await request.json()
            const card = await this.service.updateCard(cardId, userId, body)

            return NextResponse.json(
                successResponse({
                    message: 'Card updated successfully',
                    card: convertBigIntToString(card),
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

    async moveCard(request: NextRequest, cardId: bigint, userId: bigint) {
        try {
            const body = await request.json()
            const card = await this.service.moveCard(cardId, userId, body)

            return NextResponse.json(
                successResponse({
                    message: 'Card moved successfully',
                    card: convertBigIntToString(card),
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

    async deleteCard(request: NextRequest, cardId: bigint, userId: bigint) {
        try {
            await this.service.deleteCard(cardId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Card deleted successfully',
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