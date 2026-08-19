import { SettingsController } from '@/lib/controllers/settings.controller'
import { withMiddleware } from '@/lib/utils/with-middleware'

const controller = new SettingsController()

// GET user preferences
export const GET = withMiddleware((request, ctx) =>
    controller.getUserPreferences(request, ctx.userId)
)

// PATCH update preferences or change password
export const PATCH = withMiddleware(async (request, ctx) => {
    const body = await request.json()

    // Route to the appropriate handler based on the body content
    if ('currentPassword' in body || 'newPassword' in body) {
        return controller.changePassword(request, ctx.userId, body)
    }
    return controller.updateUserPreferences(request, ctx.userId, body)
})

// DELETE account
export const DELETE = withMiddleware((request, ctx) =>
    controller.deleteAccount(request, ctx.userId)
)
