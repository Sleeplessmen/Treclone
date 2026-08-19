import { WorkspaceController } from '@/lib/controllers/workspace.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new WorkspaceController()

// GET all workspaces for current user
export const GET = withMiddleware((request, ctx) =>
    controller.getWorkspaces(request, ctx.userId)
)

// POST create workspace
export const POST = withMiddleware((request, ctx) =>
    controller.createWorkspace(request, ctx.userId)
)