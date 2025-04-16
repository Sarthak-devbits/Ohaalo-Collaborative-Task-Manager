import { z } from 'zod';

export const listCreateSchema = z.object({
  listName: z
    .string()
    .min(3, 'listName should be at least 3 character')
    .max(20, 'listName should be less than 20 character'),
  boardId: z.number().min(1, 'boardId is required'),
});

export const listUpdateSchema = z
  .object({
    listName: z
      .string()
      .min(3, 'listName should be at least 3 character')
      .max(20, 'listName should be less than 20 character').optional(),
    listId: z.number().min(1, 'boardId is required').optional()
  })
  .strict();
