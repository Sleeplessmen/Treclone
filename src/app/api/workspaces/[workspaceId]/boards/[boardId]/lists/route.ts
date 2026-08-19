import { ListController } from '@/lib/controllers/list.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new ListController()

export const GET = withMiddleware((request, ctx) =>
    controller.getLists(request, BigInt(ctx.params.boardId), ctx.userId)
)

export const POST = withMiddleware((request, ctx) =>
    controller.createList(request, BigInt(ctx.params.boardId), ctx.userId)
)
