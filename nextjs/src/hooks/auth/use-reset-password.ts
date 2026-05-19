'use client'

import { useMutation } from '@tanstack/react-query'

interface ResetPasswordInput {
    token: string
    password: string
    passwordConfirmation: string
}

interface ResetPasswordResponse {
    success: boolean
    message: string
    user?: {
        id: string
        email: string
        fullName: string
    }
}

export function useResetPassword() {
    return useMutation<ResetPasswordResponse, Error, ResetPasswordInput>({
        mutationFn: async (data) => {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Password reset failed')
            }

            return response.json()
        },
    })
}