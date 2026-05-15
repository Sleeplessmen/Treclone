import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { updateProfileSchema } from '@/lib/validation/auth'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import * as bcrypt from 'bcryptjs'

// GET current user profile
export async function GET(request: NextRequest) {
    try {
        const { valid, userId } = verifyTokenFromCookie(request)

        if (!valid || !userId) {
            return errorResponse('Unauthorized', 401)
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        if (!user) {
            return errorResponse('User not found', 404)
        }

        return successResponse({
            message: 'Profile retrieved successfully',
            user,
        })
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Failed to retrieve profile'
        return errorResponse(errorMessage, 400)
    }
}

// PATCH update user profile
export async function PATCH(request: NextRequest) {
    try {
        const { valid, userId } = verifyTokenFromCookie(request)

        if (!valid || !userId) {
            return errorResponse('Unauthorized', 401)
        }

        const body = await request.json()
        const validatedData = updateProfileSchema.parse(body)

        const updateData: any = {}

        // Update fullName if provided
        if (validatedData.fullName) {
            updateData.fullName = validatedData.fullName
        }

        // Hash and update password if provided
        if (validatedData.password) {
            const hashedPassword = await bcrypt.hash(validatedData.password, 10)
            updateData.password = hashedPassword
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                fullName: true,
                updatedAt: true,
            },
        })

        return successResponse({
            message: 'Profile updated successfully',
            user: updatedUser,
        })
    } catch (error) {
        if (error instanceof SyntaxError) {
            return errorResponse('Invalid JSON in request body', 400)
        }

        const errorMessage =
            error instanceof Error ? error.message : 'Failed to update profile'
        return errorResponse(errorMessage, 400)
    }
}