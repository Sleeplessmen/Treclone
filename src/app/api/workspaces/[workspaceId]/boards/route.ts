import { BoardController } from '@/lib/controllers/board.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new BoardController()

export const GET = withMiddleware((request, ctx) =>
    controller.getBoards(request, BigInt(ctx.params.workspaceId), ctx.userId)
)

export const POST = withMiddleware((request, ctx) =>
    controller.createBoard(request, BigInt(ctx.params.workspaceId), ctx.userId)
)
