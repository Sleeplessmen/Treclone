'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface WorkspaceResponse {
    success: boolean
    data: {
        id: string
        name: string
        description?: string
        ownerId: string
        createdAt: string
        updatedAt: string
    }
}

interface WorkspaceMemberResponse {
    success: boolean
    data: {
        id: string
        userId: string
        workspaceId: string
        role: 'owner' | 'admin' | 'member'
        createdAt: string
        updatedAt: string
    }
}

interface WorkspaceSettingsResponse {
    success: boolean
    data: {
        id: string
        workspaceId: string
        defaultRole: string
        allowPublicBoards: boolean
        createdAt: string
        updatedAt: string
    }
}

interface CreateWorkspaceInput {
    name: string
    description?: string
}

interface UpdateWorkspaceInput {
    name?: string
    description?: string
}

interface AddWorkspaceMemberInput {
    userId: string
    role?: 'admin' | 'member'
}

interface UpdateWorkspaceMemberInput {
    role: 'owner' | 'admin' | 'member'
}

interface UpdateWorkspaceSettingsInput {
    defaultRole?: string
    allowPublicBoards?: boolean
}

// Create workspace
export function useCreateWorkspace() {
    const queryClient = useQueryClient()

    return useMutation<WorkspaceResponse, Error, CreateWorkspaceInput>({
        mutationFn: async (data) => {
            const response = await fetch('/api/workspaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to create workspace')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] })
        },
    })
}

// Update workspace
export function useUpdateWorkspace(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation<WorkspaceResponse, Error, UpdateWorkspaceInput>({
        mutationFn: async (data) => {
            const response = await fetch(`/api/workspaces/${workspaceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update workspace')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId] })
            queryClient.invalidateQueries({ queryKey: ['workspaces'] })
        },
    })
}

// Delete workspace
export function useDeleteWorkspace(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/workspaces/${workspaceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to delete workspace')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] })
        },
    })
}

// Add workspace member
export function useAddWorkspaceMember(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation<
        WorkspaceMemberResponse,
        Error,
        AddWorkspaceMemberInput
    >({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/members`,
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
                throw new Error(error.message || 'Failed to add workspace member')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace-members', workspaceId],
            })
        },
    })
}

// Update workspace member
export function useUpdateWorkspaceMember(
    workspaceId: string,
    memberId: string
) {
    const queryClient = useQueryClient()

    return useMutation<
        WorkspaceMemberResponse,
        Error,
        UpdateWorkspaceMemberInput
    >({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/members/${memberId}`,
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
                throw new Error(
                    error.message || 'Failed to update workspace member'
                )
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace-members', workspaceId],
            })
            queryClient.invalidateQueries({
                queryKey: ['workspace-member', workspaceId, memberId],
            })
        },
    })
}

// Remove workspace member
export function useRemoveWorkspaceMember(
    workspaceId: string,
    memberId: string
) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/members/${memberId}`,
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
                throw new Error(
                    error.message || 'Failed to remove workspace member'
                )
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace-members', workspaceId],
            })
        },
    })
}

// Update workspace settings
export function useUpdateWorkspaceSettings(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation<
        WorkspaceSettingsResponse,
        Error,
        UpdateWorkspaceSettingsInput
    >({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/settings`,
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
                throw new Error(
                    error.message || 'Failed to update workspace settings'
                )
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace-settings', workspaceId],
            })
        },
    })
}

// Delete workspace settings
export function useDeleteWorkspaceSettings(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/settings`,
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
                throw new Error(
                    error.message || 'Failed to delete workspace settings'
                )
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['workspace-settings', workspaceId],
            })
        },
    })
}