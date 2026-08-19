import { ListController } from '@/lib/controllers/list.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new ListController()

export const GET = withMiddleware((request, ctx) =>
    controller.getList(request, BigInt(ctx.params.listId), ctx.userId)
)

export const PATCH = withMiddleware((request, ctx) =>
    controller.updateList(request, BigInt(ctx.params.listId), ctx.userId)
)

export const DELETE = withMiddleware((request, ctx) =>
    controller.deleteList(request, BigInt(ctx.params.listId), ctx.userId)
)
