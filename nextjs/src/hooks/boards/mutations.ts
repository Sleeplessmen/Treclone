'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateBoardInput {
    title: string
    description?: string
}

interface UpdateBoardInput {
    title?: string
    description?: string
}

interface BoardResponse {
    success: boolean
    message: string
    board?: {
        id: string
        title: string
        description?: string
        ownerId: string
        workspaceId: string
        createdAt: string
        updatedAt: string
    }
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
export function useUpdateBoard(boardId: string) {
    const queryClient = useQueryClient()

    return useMutation<BoardResponse, Error, UpdateBoardInput>({
        mutationFn: async (data) => {
            const response = await fetch(`/api/workspaces/[workspaceId]/boards/${boardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update board')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['board', boardId] })
        },
    })
}

// Delete board
export function useDeleteBoard(workspaceId: string, boardId: string) {
    const queryClient = useQueryClient()

    return useMutation<BoardResponse, Error>({
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
            queryClient.removeQueries({ queryKey: ['board', boardId] })
        },
    })
}