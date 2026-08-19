import { CardController } from '@/lib/controllers/card.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new CardController()

export const GET = withMiddleware((request, ctx) =>
    controller.getCard(request, BigInt(ctx.params.cardId), ctx.userId)
)

export const PATCH = withMiddleware((request, ctx) =>
    controller.updateCard(request, BigInt(ctx.params.cardId), ctx.userId)
)

export const DELETE = withMiddleware((request, ctx) =>
    controller.deleteCard(request, BigInt(ctx.params.cardId), ctx.userId)
)
