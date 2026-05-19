'use client'

import { useMutation } from '@tanstack/react-query'

interface ForgotPasswordInput {
    email: string
}

interface ForgotPasswordResponse {
    success: boolean
    message: string
    // resetToken?: string
}

export function useForgotPassword() {
    return useMutation<ForgotPasswordResponse, Error, ForgotPasswordInput>({
        mutationFn: async (data) => {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to send reset email')
            }

            return response.json()
        },
    })
}