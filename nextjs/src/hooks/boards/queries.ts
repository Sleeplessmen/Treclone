'use client'

import { useQuery } from '@tanstack/react-query'

interface Board {
    id: string
    title: string
    description?: string
    ownerId: string
    workspaceId: string
    createdAt: string
    updatedAt: string
    _count?: { lists: number }
}

interface FetchBoardsResponse {
    success: boolean
    message: string
    boards: Board[]
}

interface FetchBoardResponse {
    success: boolean
    message: string
    board: Board
}

// Fetch all boards in workspace
export function useBoards(workspaceId: string) {
    return useQuery<FetchBoardsResponse, Error>({
        queryKey: ['boards', workspaceId],
        queryFn: async () => {
            const response = await fetch(`/api/workspaces/${workspaceId}/boards`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to fetch boards')
            }

            return response.json()
        },
    })
}

// Fetch single board
export function useBoard(boardId: string) {
    return useQuery<FetchBoardResponse, Error>({
        queryKey: ['board', boardId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/[workspaceId]/boards/${boardId}`,
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

            return response.json()
        },
    })
}