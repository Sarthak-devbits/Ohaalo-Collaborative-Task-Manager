import { z } from 'zod';

export const registerValidationSchema = z
  .object({
    username: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});
