import { z } from 'zod';

export const quoteFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Phone number is too long'),
  company: z.string().min(2, 'Company must be at least 2 characters'),
  service: z.string().min(1, 'Select a service'),
  budget: z.string().optional(),
  requirements: z
    .string()
    .min(20, 'Requirements must be at least 20 characters'),
  timeline: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
