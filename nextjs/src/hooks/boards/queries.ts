'use client'

import { useQuery } from '@tanstack/react-query'

interface Board {
    id: string
    title: string
    description?: string
    workspaceId: string
    createdAt: string
    updatedAt: string
}

interface FetchBoardResponse {
    success: boolean
    data: Board
}

interface FetchBoardsResponse {
    success: boolean
    data: {
        message: string
        boards: Board[]
    }
}

// Fetch all boards in a workspace
export function useBoards(workspaceId: string) {
    return useQuery<FetchBoardsResponse['data'], Error>({
        queryKey: ['boards', workspaceId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards`,
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
                throw new Error(error.message || 'Failed to fetch boards')
            }

            const json = await response.json()
            return json.data
        },
        enabled: !!workspaceId,
    })
}

// Fetch single board
export function useBoard(workspaceId: string, boardId: string) {
    return useQuery<FetchBoardResponse['data'], Error>({
        queryKey: ['board', workspaceId, boardId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/boards/${boardId}`,
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
                throw new Error(error.message || 'Failed to fetch board')
            }

            const json = await response.json()
            return json.data
        },
        enabled: !!workspaceId && !!boardId,
    })
}