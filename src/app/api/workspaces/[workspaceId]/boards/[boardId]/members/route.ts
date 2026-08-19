import { BoardMemberController } from '@/lib/controllers/board-member.controller'
import { badRequest } from '@/lib/utils/api-utils'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new BoardMemberController()

function parseBoardId(boardId: string): bigint | null {
    try {
        return BigInt(boardId)
    } catch {
        return null
    }
}

export const GET = withMiddleware(async (request, ctx) => {
    const parsedBoardId = parseBoardId(ctx.params.boardId)
    if (!parsedBoardId) {
        return badRequest('Invalid board ID')
    }
    return controller.getMembers(request, parsedBoardId, ctx.userId)
})

export const POST = withMiddleware(async (request, ctx) => {
    const parsedBoardId = parseBoardId(ctx.params.boardId)
    if (!parsedBoardId) {
        return badRequest('Invalid board ID')
    }
    return controller.addMember(request, parsedBoardId, ctx.userId)
})

export const DELETE = withMiddleware(async (request, ctx) => {
    const parsedBoardId = parseBoardId(ctx.params.boardId)
    if (!parsedBoardId) {
        return badRequest('Invalid board ID')
    }
    return controller.removeMember(request, parsedBoardId, ctx.userId)
})
