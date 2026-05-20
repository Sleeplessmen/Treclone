'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UserResponse {
    success: boolean
    data: {
        id: string
        email: string
        name: string
        avatar?: string
        createdAt: string
        updatedAt: string
    }
}

interface UserPreferencesResponse {
    success: boolean
    data: {
        theme: 'light' | 'dark' | 'system'
        language: string
        timezone: string
        notifications: {
            email: boolean
            push: boolean
            inApp: boolean
        }
    }
}

interface UpdateProfileInput {
    name?: string
    avatar?: string
}

interface UpdateUserPreferencesInput {
    theme?: 'light' | 'dark' | 'system'
    language?: string
    timezone?: string
    notifications?: {
        email?: boolean
        push?: boolean
        inApp?: boolean
    }
}

interface ChangePasswordInput {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

// Update user profile
export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation<UserResponse, Error, UpdateProfileInput>({
        mutationFn: async (data) => {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to update profile')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}

// Update user preferences/settings
export function useUpdateUserPreferences() {
    const queryClient = useQueryClient()

    return useMutation<
        UserPreferencesResponse,
        Error,
        UpdateUserPreferencesInput
    >({
        mutationFn: async (data) => {
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(
                    error.message || 'Failed to update user preferences'
                )
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-preferences'] })
        },
    })
}

// Change password
export function useChangePassword() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: ChangePasswordInput) => {
            const response = await fetch('/api/settings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    action: 'changePassword',
                    ...data,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to change password')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}

// Delete account
export function useDeleteAccount() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/settings', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to delete account')
            }

            return response.json()
        },
        onSuccess: () => {
            queryClient.clear()
        },
    })
}