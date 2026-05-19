'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface AddMemberInput {
    email: string
    role?: 'viewer' | 'editor' | 'admin'
}

interface RemoveMemberInput {
    memberId: string
}

interface MemberResponse {
    success: boolean
    message: string
    member?: {
        id: string
        userId: string
        workspaceId: string
        role: string
        joinedAt: string
        user: {
            id: string
            email: string
            fullName: string
        }
    }
}

// Add member to workspace
export function useAddMember(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation<MemberResponse, Error, AddMemberInput>({
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
                throw new Error(error.message || 'Failed to add member')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', workspaceId] })
        },
    })
}

// Remove member from workspace
export function useRemoveMember(workspaceId: string) {
    const queryClient = useQueryClient()

    return useMutation<MemberResponse, Error, RemoveMemberInput>({
        mutationFn: async (data) => {
            const response = await fetch(
                `/api/workspaces/${workspaceId}/members/${data.memberId}`,
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
                throw new Error(error.message || 'Failed to remove member')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', workspaceId] })
        },
    })
}