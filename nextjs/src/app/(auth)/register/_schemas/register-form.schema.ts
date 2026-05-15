import { registerSchema } from '@/lib/validation/auth'

// Re-export the schema from the central validation
export const registerFormSchema = registerSchema

export type RegisterFormValues = {
    fullName: string
    email: string
    password: string
}