import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { ProfileService } from '@/lib/services/profile.service'
import { handleAuthError } from '@/lib/utils/error-handler'

export class ProfileController {
    private readonly service = new ProfileService()

    async getProfile(request: NextRequest, userId: bigint) {
        try {
            const user = await this.service.getProfile(userId)

            return NextResponse.json(
                successResponse({
                    message: 'Profile retrieved successfully',
                    user: {
                        ...user,
                        id: user.id.toString(),
                    },
                })
            )
        } catch (error) {
            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }

    async updateProfile(request: NextRequest, userId: bigint) {
        try {
            const body = await request.json()
            const updatedUser = await this.service.updateProfile(userId, body)

            return NextResponse.json(
                successResponse({
                    message: 'Profile updated successfully',
                    user: {
                        ...updatedUser,
                        id: updatedUser.id.toString(),
                    },
                })
            )
        } catch (error) {
            const authError = handleAuthError(error)
            return NextResponse.json(
                errorResponse(authError.message, authError.statusCode),
                { status: authError.statusCode }
            )
        }
    }
}