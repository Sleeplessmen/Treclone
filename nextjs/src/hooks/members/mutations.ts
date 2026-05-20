'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface BoardMemberResponse {
    success: boolean
    data: {
        id: string
        userId: string
        boardId: string
        role: 'admin' | 'editor' | 'viewer'
        createdAt: string
        updatedAt: string
    }
}

interface AddBoardMemberInput {
    userId: string
    role?: 'admin' | 'editor' | 'viewer'
}

interface UpdateBoardMemberInput {
    role: 'admin' | 'editor' | 'viewer'
}

// Add board member
export function useAddBoardMember(
    workspaceId: string,
    boardId: string
) {
    const queryClient = useQueryClient()

    return useMutation<BoardMemberResponse, Error, AddBoardMemberInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/members`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to add board member')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['board-members', workspaceId, boardId],
            })
        },
    })
}

// Update board member
export function useUpdateBoardMember(
    workspaceId: string,
    boardId: string,
    memberId: string
) {
    const queryClient = useQueryClient()

    return useMutation<BoardMemberResponse, Error, UpdateBoardMemberInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/members/${memberId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update board member')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['board-members', workspaceId, boardId],
            })
            queryClient.invalidateQueries({
                queryKey: ['board-member', workspaceId, boardId, memberId],
            })
        },
    })
}

// Remove board member
export function useRemoveBoardMember(
    workspaceId: string,
    boardId: string,
    memberId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/members/${memberId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to remove board member')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['board-members', workspaceId, boardId],
            })
        },
    })
}