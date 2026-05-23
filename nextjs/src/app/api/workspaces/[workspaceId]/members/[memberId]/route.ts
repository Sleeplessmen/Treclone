import { NextRequest } from 'next/server'
import { WorkspaceMemberController } from '@/lib/controllers/workspace-member.controller'
import { verifyTokenFromCookie } from '@/lib/utils/auth'
import { badRequest, unauthorized } from '@/lib/utils/api-utils'

const controller = new WorkspaceMemberController()

type RouteParams = {
    workspaceId: string
    memberId: string
}

function parseId(value: string): bigint | null {
    try {
        return BigInt(value)
    } catch {
        return null
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<RouteParams> }
) {
    const { workspaceId, memberId } = await params
    const parsedWorkspaceId = parseId(workspaceId)
    const parsedMemberId = parseId(memberId)

    if (!parsedWorkspaceId || !parsedMemberId) {
        return badRequest('Invalid workspace or member ID')
    }

    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return unauthorized()
    }

    return controller.updateMember(
        request,
        parsedWorkspaceId,
        parsedMemberId,
        userId
    )
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<RouteParams> }
) {
    const { workspaceId, memberId } = await params
    const parsedWorkspaceId = parseId(workspaceId)
    const parsedMemberId = parseId(memberId)

    if (!parsedWorkspaceId || !parsedMemberId) {
        return badRequest('Invalid workspace or member ID')
    }

    const { valid, userId } = verifyTokenFromCookie(request)

    if (!valid || !userId) {
        return unauthorized()
    }

    return controller.removeMemberById(
        request,
        parsedWorkspaceId,
        parsedMemberId,
        userId
    )
}