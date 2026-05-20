'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface BoardResponse {
    success: boolean
    data: {
        id: string
        title: string
        description?: string
        workspaceId: string
        createdAt: string
        updatedAt: string
    }
}

interface CreateBoardInput {
    title: string
    description?: string
}

interface UpdateBoardInput {
    title?: string
    description?: string
}

// Create board
export function useCreateBoard(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation<BoardResponse, Error, CreateBoardInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards`,
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
                throw new Error(error.message || 'Failed to create board')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards', workspaceId] })
        },
    })
}

// Update board
export function useUpdateBoard(workspaceId: string, boardId: string) {
    const queryClient = useQueryClient()

    return useMutation<BoardResponse, Error, UpdateBoardInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}`,
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
                throw new Error(error.message || 'Failed to update board')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', workspaceId, boardId] })
            queryClient.invalidateQueries({ queryKey: ['boards', workspaceId] })
        },
    })
}

// Delete board
export function useDeleteBoard(workspaceId: string, boardId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}`,
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
                throw new Error(error.message || 'Failed to delete board')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards', workspaceId] })
        },
    })
}