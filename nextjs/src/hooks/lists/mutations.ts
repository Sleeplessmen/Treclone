'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ListResponse {
    success: boolean
    data: {
        id: string
        title: string
        position: number
        boardId: string
        createdAt: string
        updatedAt: string
    }
}

interface CreateListInput {
    title: string
}

interface UpdateListInput {
    title?: string
    position?: number
}

// Create list
export function useCreateList(workspaceId: string, boardId: string) {
    const queryClient = useQueryClient()

    return useMutation<ListResponse, Error, CreateListInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/lists`,
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
                throw new Error(error.message || 'Failed to create list')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['lists', workspaceId, boardId],
            })
        },
    })
}

// Update list
export function useUpdateList(
    workspaceId: string,
    boardId: string,
    listId: string
) {
    const queryClient = useQueryClient()

    return useMutation<ListResponse, Error, UpdateListInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}`,
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
                throw new Error(error.message || 'Failed to update list')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['lists', workspaceId, boardId],
            })
            queryClient.invalidateQueries({
                queryKey: ['list', workspaceId, boardId, listId],
            })
        },
    })
}

// Delete list
export function useDeleteList(
    workspaceId: string,
    boardId: string,
    listId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}`,
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
                throw new Error(error.message || 'Failed to delete list')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['lists', workspaceId, boardId],
            })
        },
    })
}