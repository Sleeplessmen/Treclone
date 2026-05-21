'use client'

import { useQuery } from '@tanstack/react-query'

interface BoardMember {
    id: string
    userId: string
    boardId: string
    role: 'admin' | 'editor' | 'viewer'
    user: {
        id: string
        email: string
        name: string
    }
    createdAt: string
    updatedAt: string
}

interface FetchBoardMembersResponse {
    success: boolean
    data: BoardMember[]
}

interface FetchBoardMemberResponse {
    success: boolean
    data: BoardMember
}

// Fetch all board members
export function useBoardMembers(
    workspaceId: string,
    boardId: string
) {
    return useQuery<FetchBoardMembersResponse, Error>({
        queryKey: ['board-members', workspaceId, boardId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/members`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to fetch board members')
            }

            return response.json()
        },
        enabled: !!workspaceId && !!boardId,
    })
}

// Fetch single board member (if needed)
export function useBoardMember(
    workspaceId: string,
    boardId: string,
    memberId: string
) {
    return useQuery<FetchBoardMemberResponse, Error>({
        queryKey: ['board-member', workspaceId, boardId, memberId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/members/${memberId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to fetch board member')
            }

            return response.json()
        },
        enabled: !!workspaceId && !!boardId && !!memberId,
    })
}