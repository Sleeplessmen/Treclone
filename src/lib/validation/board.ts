import { z } from 'zod';

export const createBoardSchema = z.object({
    title: z.string().trim().min(1, 'Board title is required').max(255),
    description: z.string().trim().max(500).optional(),
});

export const updateBoardSchema = z.object({
    title: z.string().trim().min(1, 'Board title is required').max(255).optional(),
    description: z.string().trim().max(500).optional(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;