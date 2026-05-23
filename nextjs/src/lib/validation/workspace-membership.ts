import { z } from 'zod';

export const workspaceMemberRoleSchema = z.enum(['member', 'admin']);

export const addWorkspaceMemberSchema = z.object({
    email: z.email('Invalid email address'),
    role: workspaceMemberRoleSchema.optional().default('member'),
});

export const updateWorkspaceMemberSchema = z.object({
    role: workspaceMemberRoleSchema,
});

export const removeWorkspaceMemberSchema = z.object({
    memberId: z.coerce.bigint('Member ID is required'),
});

export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
export type UpdateWorkspaceMemberInput = z.infer<
    typeof updateWorkspaceMemberSchema
>;
export type RemoveWorkspaceMemberInput = z.infer<
    typeof removeWorkspaceMemberSchema
>;
export type WorkspaceMemberRoleInput = z.infer<typeof workspaceMemberRoleSchema>;