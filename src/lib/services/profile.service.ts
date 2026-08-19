import { updateProfileSchema } from '@/lib/validation/auth'
import { ProfileRepository } from '@/lib/repositories/profile.repository'
import { AppError, ErrorCode } from '@/lib/utils/errors'

export class ProfileService {
    private readonly repository = new ProfileRepository()

    async getProfile(userId: bigint) {
        try {
            const user = await this.repository.getUserById(userId)

            if (!user) {
                throw new AppError('User not found', 404, ErrorCode.USER_NOT_FOUND)
            }

            return user
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to retrieve profile',
                500,
                ErrorCode.INTERNAL_ERROR
            )
        }
    }

    async updateProfile(userId: bigint, credentials: unknown) {
        try {
            // Validate input
            const validatedData = updateProfileSchema.parse(credentials)

            const updateData: {
                fullName?: string
            } = {}

            // Update fullName if provided
            if (validatedData.fullName) {
                updateData.fullName = validatedData.fullName
            }

            const updatedUser = await this.repository.updateUserProfile(userId, updateData)

            return updatedUser
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new AppError(
                'Failed to update profile',
                400,
                ErrorCode.VALIDATION_ERROR
            )
        }
    }
}