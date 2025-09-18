import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.email().max(100).toLowerCase().trim(),
  password: z.string().min(8).max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signInSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});
