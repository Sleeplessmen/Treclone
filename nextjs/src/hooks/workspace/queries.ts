'use client'

import { useQuery } from '@tanstack/react-query'

interface WorkspaceSettings {
    id: string
    workspaceId: string
    defaultRole: string
    allowPublicBoards: boolean
    createdAt: string
    updatedAt: string
}

interface Workspace {
    id: string
    name: string
    description?: string
    ownerId: string
    createdAt: string
    updatedAt: string
}

interface FetchWorkspacesResponse {
    success: boolean
    data: {
        message: string
        workspaces: Workspace[]
    }
}

interface FetchWorkspaceResponse {
    success: boolean
    data: Workspace
}

interface FetchWorkspaceSettingsResponse {
    success: boolean
    data: WorkspaceSettings
}

// Fetch all workspaces for user
export function useWorkspaces() {
    return useQuery<FetchWorkspacesResponse['data'], Error>({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const response = await fetch('/api/workspaces', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to fetch workspaces')
            }

            const json = await response.json()
            return json.data
        },
    })
}

// Fetch single workspace
export function useWorkspace(workspaceId: string) {
    return useQuery<FetchWorkspaceResponse['data'], Error>({
        queryKey: ['workspace', workspaceId],
        queryFn: async () => {
            const response = await fetch(`/api/workspaces/${workspaceId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to fetch workspace')
            }

            const json = await response.json()
            return json.data
        },
        enabled: !!workspaceId,
    })
}

// Fetch workspace settings
export function useWorkspaceSettings(workspaceId: string) {
    return useQuery<FetchWorkspaceSettingsResponse, Error>({
        queryKey: ['workspace-settings', workspaceId],
        queryFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/settings`,
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
                throw new Error(
                    error.message || 'Failed to fetch workspace settings'
                )
            }

            return response.json()
        },
        enabled: !!workspaceId,
    })
}