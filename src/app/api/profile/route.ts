import { ProfileController } from '@/lib/controllers/profile.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new ProfileController()

export const GET = withMiddleware((request, ctx) =>
    controller.getProfile(request, ctx.userId)
)

export const PATCH = withMiddleware((request, ctx) =>
    controller.updateProfile(request, ctx.userId)
)
