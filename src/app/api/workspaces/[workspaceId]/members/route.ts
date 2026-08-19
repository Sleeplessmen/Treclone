import { WorkspaceMemberController } from '@/lib/controllers/workspace-member.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new WorkspaceMemberController()

export const GET = withMiddleware((request, ctx) =>
    controller.getMembers(request, BigInt(ctx.params.workspaceId), ctx.userId)
)

export const POST = withMiddleware((request, ctx) =>
    controller.addMember(request, BigInt(ctx.params.workspaceId), ctx.userId)
)