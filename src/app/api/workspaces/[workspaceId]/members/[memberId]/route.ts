import { WorkspaceMemberController } from '@/lib/controllers/workspace-member.controller'
import { badRequest } from '@/lib/utils/api-utils'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new WorkspaceMemberController()

function parseId(value: string): bigint | null {
    try {
        return BigInt(value)
    } catch {
        return null
    }
}

export const PATCH = withMiddleware(async (request, ctx) => {
    const parsedWorkspaceId = parseId(ctx.params.workspaceId)
    const parsedMemberId = parseId(ctx.params.memberId)

    if (!parsedWorkspaceId || !parsedMemberId) {
        return badRequest('Invalid workspace or member ID')
    }

    return controller.updateMember(
        request,
        parsedWorkspaceId,
        parsedMemberId,
        ctx.userId
    )
})

export const DELETE = withMiddleware(async (request, ctx) => {
    const parsedWorkspaceId = parseId(ctx.params.workspaceId)
    const parsedMemberId = parseId(ctx.params.memberId)

    if (!parsedWorkspaceId || !parsedMemberId) {
        return badRequest('Invalid workspace or member ID')
    }

    return controller.removeMemberById(
        request,
        parsedWorkspaceId,
        parsedMemberId,
        ctx.userId
    )
})