'use client'

import { useQuery } from '@tanstack/react-query'

interface User {
    id: string
    email: string
    name: string
    avatar?: string
    createdAt: string
    updatedAt: string
}

interface UserPreferences {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    notifications: {
        email: boolean
        push: boolean
        inApp: boolean
    }
}

interface FetchUserResponse {
    success: boolean
    data: User
}

interface FetchUserPreferencesResponse {
    success: boolean
    data: UserPreferences
}

// Fetch current user profile
export function useProfile() {
    return useQuery<FetchUserResponse, Error>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await fetch('/api/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to fetch profile')
            }

            return response.json()
        },
    })
}

// Fetch user preferences/settings
export function useUserPreferences() {
    return useQuery<FetchUserPreferencesResponse, Error>({
        queryKey: ['user-preferences'],
        queryFn: async () => {
            const response = await fetch('/api/settings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(
                    error.message || 'Failed to fetch user preferences'
                )
            }

            return response.json()
        },
    })
}