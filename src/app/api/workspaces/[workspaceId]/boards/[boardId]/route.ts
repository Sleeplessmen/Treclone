import { BoardController } from '@/lib/controllers/board.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new BoardController()

export const GET = withMiddleware((request, ctx) =>
    controller.getBoard(request, BigInt(ctx.params.boardId), ctx.userId)
)

export const PATCH = withMiddleware((request, ctx) =>
    controller.updateBoard(request, BigInt(ctx.params.boardId), ctx.userId)
)

export const DELETE = withMiddleware((request, ctx) =>
    controller.deleteBoard(request, BigInt(ctx.params.boardId), ctx.userId)
)
