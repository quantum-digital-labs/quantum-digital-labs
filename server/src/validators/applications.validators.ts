import { z } from 'zod';

const boolFromForm = z
  .union([z.boolean(), z.string()])
  .transform((value) => value === true || value === 'true');

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  education: z.string().min(1),
  experience: z.string().min(1),
  skills: z.string().min(1),
  linkedin: z.string().optional().default(''),
  portfolio: z.string().optional().default(''),
  coverLetter: z.string().min(1),
  panNumber: z.string().min(1),
  aadhaarNumber: z.string().min(1),
  acceptTerms: boolFromForm,
});

export const internshipApplicationSchema = z.object({
  internshipId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  college: z.string().min(1),
  course: z.string().min(1),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  skills: z.string().min(1),
  message: z.string().min(1),
  panNumber: z.string().min(1),
  aadhaarNumber: z.string().min(1),
  acceptTerms: boolFromForm,
});

export const jobStatusSchema = z.object({
  status: z.enum(['received', 'reviewing', 'shortlisted', 'rejected', 'hired']),
});

export const internshipStatusSchema = z.object({
  status: z.enum([
    'received',
    'reviewing',
    'shortlisted',
    'rejected',
    'selected',
  ]),
});

export const referenceParamSchema = z.object({
  referenceNumber: z.string().min(1),
});
