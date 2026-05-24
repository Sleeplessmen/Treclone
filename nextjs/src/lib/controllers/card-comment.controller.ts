import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, convertBigIntToString } from '@/lib/utils/api-utils'
import { CardCommentService } from '@/lib/services/card-comment.service'
import { createAuditLog } from '@/lib/services/audit.service'
import { handleAuthError } from '@/lib/utils/error-handler'

export class CardCommentController {
    private readonly service = new CardCommentService()

    async getComments(request: NextRequest, cardId: bigint, userId: bigint) {
        try {
            const comments = await this.service.getCommentsByCardId(cardId, userId)

            return NextResponse.json(
                successResponse({
                    message: 'Card comments fetched successfully',
                    comments: convertBigIntToString(comments),
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

    async createComment(request: NextRequest, cardId: bigint, userId: bigint) {
        try {
            const body = await request.json()
            const comment = await this.service.createComment(cardId, userId, body)
            const workspaceId = await this.service.getCardWorkspaceId(cardId)

            await createAuditLog({
                userId,
                action: 'CREATE',
                entity: 'CARD_COMMENT',
                entityId: comment.id,
                workspaceId: workspaceId ?? undefined,
                status: 'SUCCESS',
                metadata: {
                    cardId: cardId.toString(),
                    commentId: comment.id.toString(),
                },
            })

            return NextResponse.json(
                successResponse(
                    {
                        message: 'Card comment created successfully',
                        comment: convertBigIntToString(comment),
                    },
                    201
                ),
                { status: 201 }
            )
        } catch (error) {
            if (error instanceof Error) {
                await createAuditLog({
                    userId,
                    action: 'CREATE',
                    entity: 'CARD_COMMENT',
                    entityId: BigInt(0),
                    status: 'FAILURE',
                    errorMessage: error.message,
                })
            }

            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }
}
