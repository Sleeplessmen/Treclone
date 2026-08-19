import { z } from 'zod';

export const createCardCommentSchema = z.object({
    content: z.string().trim().min(1, 'Comment is required').max(1000),
});

export type CreateCardCommentInput = z.infer<typeof createCardCommentSchema>;
