import { z } from 'zod'

export const addMemberSchema = z.object({
    email: z.email('Invalid email address'),
    role: z.enum(['viewer', 'editor', 'admin']).optional().default('editor'),
})

export const removeMemberSchema = z.object({
    memberId: z.bigint('Member ID is required'),
})

export type AddMemberInput = z.infer<typeof addMemberSchema>
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>