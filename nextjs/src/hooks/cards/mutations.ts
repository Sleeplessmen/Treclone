'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateCardInput {
    title: string
    description?: string
    position: number
    listId: string
}

interface UpdateCardInput {
    title?: string
    description?: string
    assigneeUserId?: string
}

interface CardResponse {
    success: boolean
    message: string
    card?: {
        id: string
        title: string
        description?: string
        position: number
        assigneeUserId?: string
        createdBy: string
        createdAt: string
        updatedAt: string
    }
}

// Create card
export function useCreateCard(listId: string) {
    const queryClient = useQueryClient()

    return useMutation<CardResponse, Error, Omit<CreateCardInput, 'listId'>>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/[workspaceId]/boards/[boardId]/lists/${listId}/cards`,
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
                throw new Error(error.message || 'Failed to create card')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards', listId] })
        },
    })
}

// Update card
export function useUpdateCard(cardId: string) {
    const queryClient = useQueryClient()

    return useMutation<CardResponse, Error, UpdateCardInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/[workspaceId]/boards/[boardId]/cards/${cardId}`,
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
                throw new Error(error.message || 'Failed to update card')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['card', cardId] })
        },
    })
}

// Delete card
export function useDeleteCard(cardId: string) {
    const queryClient = useQueryClient()

    return useMutation<CardResponse, Error>({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workspaces/[workspaceId]/boards/[boardId]/cards/${cardId}`,
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
                throw new Error(error.message || 'Failed to delete card')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] })
        },
    })
}