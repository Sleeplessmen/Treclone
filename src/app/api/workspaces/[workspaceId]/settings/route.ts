import { WorkspaceSettingsController } from '@/lib/controllers/workspace-settings.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new WorkspaceSettingsController()

export const GET = withMiddleware((request, ctx) =>
    controller.getSettings(request, BigInt(ctx.params.workspaceId), ctx.userId)
)

export const PATCH = withMiddleware((request, ctx) =>
    controller.updateSettings(request, BigInt(ctx.params.workspaceId), ctx.userId)
)

export const DELETE = withMiddleware((request, ctx) =>
    controller.deleteWorkspace(request, BigInt(ctx.params.workspaceId), ctx.userId)
)
