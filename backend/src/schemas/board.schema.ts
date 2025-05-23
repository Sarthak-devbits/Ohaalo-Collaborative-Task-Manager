import { Visibility } from '@prisma/client';
import { z } from 'zod';

export const boardSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(25, ''),
    visibility: z.nativeEnum(Visibility).refine((val) => val !== undefined, {
      message:
        "Visibility is required and must be either 'private' or 'public'",
    }),
    workspaceId: z.coerce
      .number({
        required_error: 'Workspace ID is required',
        invalid_type_error: 'Workspace ID must be a number',
      })
      .refine((val) => val !== undefined, {
        message: 'Workspace ID is required',
      }),
    backgroundImg: z.string().min(1, 'Background image is required').url(),
  })
  .strict();

export const boardUpdateSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(25, 'Title must not exceed 25 characters')
      .optional(), // Optional since it's an update

    visibility: z
      .nativeEnum(Visibility)
      .refine((val) => val !== undefined, {
        message: "Visibility must be either 'private' or 'public'",
      })
      .optional(),

    backgroundImg: z
      .string()
      .url('Invalid URL format for background image')
      .optional(),
  })
  .strict();

export const addBoardMemberScema = z.object({
  boardId: z.number().min(1, 'Board ID is required'),
  userIds: z.array(z.number().min(1, 'User ID is required')),
});
