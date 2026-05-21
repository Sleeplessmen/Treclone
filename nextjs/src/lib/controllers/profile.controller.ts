import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, convertBigIntToString } from '@/lib/utils/api-utils'
import { ProfileService } from '@/lib/services/profile.service'
import { handleAuthError } from '@/lib/utils/error-handler'

export class ProfileController {
    private readonly service = new ProfileService()

    async getProfile(request: NextRequest, userId: bigint) {
        try {
            const user = await this.service.getProfile(userId)

            return NextResponse.json(
                successResponse({
                    message: 'Profile fetched successfully',
                    user: convertBigIntToString(user),
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
            const user = await this.service.updateProfile(userId, body)

            return NextResponse.json(
                successResponse({
                    message: 'Profile updated successfully',
                    user: convertBigIntToString(user),
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
