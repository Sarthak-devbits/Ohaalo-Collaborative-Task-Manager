import { z } from 'zod';

export const labelCreateSchema = z.object({
  labelName: z
    .string()
    .min(3, 'labelName must have atleat 3 character')
    .max(20, 'labelName must be less than 20 character'),
  color: z.string().min(1, 'color is required'),
  boardId: z.number().min(1, 'boardId is required'),
});

export const labelUpdateSchema = z
  .object({
    id: z.number().min(1, 'labelId is required'),
    labelName: z
      .string()
      .min(3, 'labelName must have atleat 3 character')
      .max(20, 'labelName must be less than 20 character')
      .optional(),
    color: z.string().min(1, 'color is required').optional(),
    boardId: z.number().min(1, 'boardId is required').optional(),
  })
  .strict();
