import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse, convertBigIntToString } from '@/lib/api-utils'
import { getAuthToken, extractUserIdFromToken } from '@/lib/auth-utils'
import { z } from 'zod'

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(255),
})

// GET all workspaces for the current user
export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return errorResponse('Unauthorized - missing token', 401)
    }

    const userId = extractUserIdFromToken(token)

    if (!userId) {
      return errorResponse('Unauthorized - invalid token', 401)
    }

    const workspaces = await prisma.workspace.findMany({
      where: { ownerId: userId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { boards: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse({
      message: 'Workspaces fetched successfully',
      workspaces: convertBigIntToString(workspaces),
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch workspaces'
    return errorResponse(errorMessage, 400)
  }
}

// POST create a new workspace
export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return errorResponse('Unauthorized - missing token', 401)
    }

    const userId = extractUserIdFromToken(token)

    if (!userId) {
      return errorResponse('Unauthorized - invalid token', 401)
    }

    const body = await request.json()
    const validatedData = createWorkspaceSchema.parse(body)

    const workspace = await prisma.workspace.create({
      data: {
        name: validatedData.name,
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return successResponse(
      {
        message: 'Workspace created successfully',
        workspace: convertBigIntToString(workspace),
      },
      201
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create workspace'
    return errorResponse(errorMessage, 400)
  }
}
