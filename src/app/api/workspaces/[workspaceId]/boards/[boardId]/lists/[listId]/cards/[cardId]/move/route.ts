import { CardController } from '@/lib/controllers/card.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new CardController()

export const PATCH = withMiddleware((request, ctx) =>
    controller.moveCard(request, BigInt(ctx.params.cardId), ctx.userId)
)
