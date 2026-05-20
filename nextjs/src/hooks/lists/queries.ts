'use client'

import { useQuery } from '@tanstack/react-query'

interface List {
    id: string
    title: string
    position: number
    boardId: string
    createdAt: string
    updatedAt: string
}

interface FetchListsResponse {
    success: boolean
    data: List[]
}

interface FetchListResponse {
    success: boolean
    data: List
}

// Fetch all lists in a board
export function useLists(workspaceId: string, boardId: string) {
    return useQuery<FetchListsResponse, Error>({
        queryKey: ['lists', workspaceId, boardId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/lists`,
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
                throw new Error(error.message || 'Failed to fetch lists')
            }

            return response.json()
        },
        enabled: !!workspaceId && !!boardId,
    })
}

// Fetch single list (if needed)
export function useList(
    workspaceId: string,
    boardId: string,
    listId: string
) {
    return useQuery<FetchListResponse, Error>({
        queryKey: ['list', workspaceId, boardId, listId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}/lists/${listId}`,
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
                throw new Error(error.message || 'Failed to fetch list')
            }

            return response.json()
        },
        enabled: !!workspaceId && !!boardId && !!listId,
    })
}