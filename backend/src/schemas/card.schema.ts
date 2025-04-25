import { z } from 'zod';

export const createCardSchema = z.object({
  listId: z.number(),
  cardTitle: z.string().min(1, 'Card title is required'),
  description: z.string().optional(), // Optional if you want to allow empty initially
  bannerImg: z.string().url().optional(), // Optional and should be a valid URL
  completed: z.boolean().optional().default(false),
  dueDate: z.coerce.date().optional(), // Coerce for string-to-date conversion
  position: z.number().optional(),
});
