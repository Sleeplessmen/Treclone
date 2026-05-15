import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse, convertBigIntToString } from '@/lib/api-utils'
import { verifyTokenFromCookie } from '@/lib/auth-utils'
import { z } from 'zod'

const addMemberSchema = z.object({
    email: z.email('Invalid email address'),
    role: z.enum(['viewer', 'editor', 'admin']).optional().default('editor'),
})

// GET all members in a workspace
export async function GET(
    request: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { valid, userId } = verifyTokenFromCookie(request)

        if (!valid || !userId) {
            return errorResponse('Unauthorized', 401)
        }

        const workspaceId = BigInt(params.workspaceId)

        // Verify workspace exists and user is owner
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
        })

        if (!workspace) {
            return errorResponse('Workspace not found', 404)
        }

        if (workspace.ownerId !== userId) {
            return errorResponse('Forbidden - not the workspace owner', 403)
        }

        // Fetch workspace members
        const members = await prisma.workspaceMember.findMany({
            where: { workspaceId },
            select: {
                id: true,
                userId: true,
                workspaceId: true,
                role: true,
                joinedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { joinedAt: 'desc' },
        })

        return successResponse({
            message: 'Workspace members fetched successfully',
            members: convertBigIntToString(members),
        })
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch members'
        return errorResponse(errorMessage, 400)
    }
}

// POST add member to workspace
export async function POST(
    request: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    try {
        const { valid, userId } = verifyTokenFromCookie(request)

        if (!valid || !userId) {
            return errorResponse('Unauthorized', 401)
        }

        const workspaceId = BigInt(params.workspaceId)

        // Verify workspace exists and user is owner
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
        })

        if (!workspace) {
            return errorResponse('Workspace not found', 404)
        }

        if (workspace.ownerId !== userId) {
            return errorResponse('Forbidden - not the workspace owner', 403)
        }

        const body = await request.json()
        const validatedData = addMemberSchema.parse(body)

        // Check if user with email exists
        const targetUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (!targetUser) {
            return errorResponse('User with this email not found', 404)
        }

        // Check if user is already a member
        const existingMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: targetUser.id,
            },
        })

        if (existingMember) {
            return errorResponse('User is already a member of this workspace', 409)
        }

        // Add member to workspace
        const newMember = await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: targetUser.id,
                role: validatedData.role,
            },
            select: {
                id: true,
                userId: true,
                workspaceId: true,
                role: true,
                joinedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        })

        return successResponse(
            {
                message: 'Member added successfully',
                member: convertBigIntToString(newMember),
            },
            201
        )
    } catch (error) {
        if (error instanceof SyntaxError) {
            return errorResponse('Invalid JSON in request body', 400)
        }

        const errorMessage =
            error instanceof Error ? error.message : 'Failed to add member'
        return errorResponse(errorMessage, 400)
    }
}