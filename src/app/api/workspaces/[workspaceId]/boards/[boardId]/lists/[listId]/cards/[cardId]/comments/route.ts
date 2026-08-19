import { CardCommentController } from '@/lib/controllers/card-comment.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new CardCommentController()

export const GET = withMiddleware((request, ctx) =>
    controller.getComments(request, BigInt(ctx.params.cardId), ctx.userId)
)

export const POST = withMiddleware((request, ctx) =>
    controller.createComment(request, BigInt(ctx.params.cardId), ctx.userId)
)
