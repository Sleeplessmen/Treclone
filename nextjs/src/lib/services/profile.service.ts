import * as bcrypt from 'bcryptjs'
import { updateProfileSchema } from '@/lib/validation/auth'
import { ProfileRepository } from '@/lib/repositories/profile.repository'
import { AuthError, AuthErrorCode } from '@/lib/utils/error-handler'

export class ProfileService {
    private readonly repository = new ProfileRepository()

    async getProfile(userId: bigint) {
        try {
            const user = await this.repository.getUserById(userId)

            if (!user) {
                throw new AuthError('User not found', 404, AuthErrorCode.USER_NOT_FOUND)
            }

            return user
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to retrieve profile',
                500,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }

    async updateProfile(userId: bigint, credentials: unknown) {
        try {
            // Validate input
            const validatedData = updateProfileSchema.parse(credentials)

            const updateData: {
                fullName?: string
                passwordHash?: string
            } = {}

            // Update fullName if provided
            if (validatedData.fullName) {
                updateData.fullName = validatedData.fullName
            }

            // Hash and update password if provided
            if (validatedData.password) {
                const hashedPassword = await bcrypt.hash(validatedData.password, 10)
                updateData.passwordHash = hashedPassword
            }

            const updatedUser = await this.repository.updateUserProfile(userId, updateData)

            return updatedUser
        } catch (error) {
            if (error instanceof AuthError) throw error
            throw new AuthError(
                'Failed to update profile',
                400,
                AuthErrorCode.INTERNAL_ERROR
            )
        }
    }
}