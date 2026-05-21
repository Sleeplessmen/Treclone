'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface AddMemberInput {
    userId: string
    role: 'admin' | 'editor' | 'viewer'
}

interface UpdateMemberInput {
    role: 'admin' | 'editor' | 'viewer'
}

export function useAddBoardMember(
    workspaceId: string,
    boardId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: AddMemberInput) => {
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
            queryClient.invalidateQueries({ queryKey: ['board-members', workspaceId, boardId] })
        },
    })
}

export function useUpdateBoardMember(
    workspaceId: string,
    boardId: string,
    memberId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: UpdateMemberInput) => {
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
            queryClient.invalidateQueries({ queryKey: ['board-members', workspaceId, boardId] })
        },
    })
}

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
            queryClient.invalidateQueries({ queryKey: ['board-members', workspaceId, boardId] })
        },
    })
}