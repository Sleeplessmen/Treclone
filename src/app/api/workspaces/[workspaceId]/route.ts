import { WorkspaceController } from '@/lib/controllers/workspace.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new WorkspaceController()

export const GET = withMiddleware((request, ctx) =>
    controller.getWorkspace(request, BigInt(ctx.params.workspaceId), ctx.userId)
)

export const PATCH = withMiddleware((request, ctx) =>
    controller.updateWorkspace(request, BigInt(ctx.params.workspaceId), ctx.userId)
)

export const DELETE = withMiddleware((request, ctx) =>
    controller.deleteWorkspace(request, BigInt(ctx.params.workspaceId), ctx.userId)
)
