'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateListInput {
    title: string
    position: number
}

interface UpdateListInput {
    title?: string
    position?: number
}

interface ListResponse {
    success: boolean
    message: string
    list?: {
        id: string
        title: string
        position: number
        createdAt: string
        updatedAt: string
    }
}

// Create list
export function useCreateList(boardId: string) {
    const queryClient = useQueryClient()

    return useMutation<ListResponse, Error, CreateListInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/[workspaceId]/boards/${boardId}/lists`,
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
            queryClient.invalidateQueries({ queryKey: ['lists', boardId] })
        },
    })
}

// Update list
export function useUpdateList(listId: string) {
    const queryClient = useQueryClient()

    return useMutation<ListResponse, Error, UpdateListInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/[workspaceId]/boards/[boardId]/lists/${listId}`,
                {
                    method: 'PUT',
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
            queryClient.invalidateQueries({ queryKey: ['list', listId] })
        },
    })
}

// Delete list
export function useDeleteList(listId: string) {
    const queryClient = useQueryClient()

    return useMutation<ListResponse, Error>({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workspaces/[workspaceId]/boards/[boardId]/lists/${listId}`,
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
            queryClient.invalidateQueries({ queryKey: ['lists'] })
        },
    })
}