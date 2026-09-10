import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  portal: z.enum(['admin', 'public']).optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Za-z]/, 'Password must include a letter')
    .regex(/[0-9]/, 'Password must include a number')
    .regex(/[^A-Za-z0-9]/, 'Password must include a special character'),
});

export const verifyEmailSchema = z
  .object({
    token: z.string().min(1).optional(),
    email: z.string().email().optional(),
    code: z.string().length(6).optional(),
  })
  .refine((data) => Boolean(data.token) || (data.email && data.code), {
    message: 'Provide either token, or email and code',
  });

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});
