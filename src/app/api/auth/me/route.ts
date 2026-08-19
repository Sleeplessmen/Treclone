import { AuthController } from '@/lib/controllers/auth.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new AuthController()

export const GET = withMiddleware((request, ctx) =>
    controller.getMe(request, ctx.userId)
)
