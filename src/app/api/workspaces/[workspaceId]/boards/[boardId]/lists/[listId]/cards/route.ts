import { CardController } from '@/lib/controllers/card.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new CardController()

export const GET = withMiddleware((request, ctx) =>
    controller.getCards(request, BigInt(ctx.params.listId), ctx.userId)
)

export const POST = withMiddleware((request, ctx) =>
    controller.createCard(request, BigInt(ctx.params.listId), ctx.userId)
)
