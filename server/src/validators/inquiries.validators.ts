import { z } from 'zod';

export const contactInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional(),
  service: z.string().min(1),
  message: z.string().min(1),
});

export const quoteInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().min(1),
  service: z.string().min(1),
  budget: z.string().optional(),
  requirements: z.string().min(1),
  timeline: z.string().optional(),
});

export const demoInquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().min(1),
  project: z.string().min(1),
  requirements: z.string().min(1),
  preferredDate: z.string().min(1),
  message: z.string().optional(),
});
