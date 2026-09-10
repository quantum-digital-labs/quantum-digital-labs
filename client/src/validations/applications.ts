import { z } from 'zod';
import { MAX_RESUME_BYTES } from '../utils/forms';

function getResumeFile(value: unknown): File | undefined {
  if (value instanceof File) return value;
  if (typeof FileList !== 'undefined' && value instanceof FileList) {
    return value.item(0) ?? undefined;
  }
  if (Array.isArray(value) && value[0] instanceof File) {
    return value[0];
  }
  return undefined;
}

function hasAllowedResume(value: unknown): boolean {
  const file = getResumeFile(value);
  if (!file) return false;
  const name = file.name.toLowerCase();
  const allowedExt =
    name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx');
  return allowedExt && file.size > 0 && file.size <= MAX_RESUME_BYTES;
}

const panNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN number (e.g. ABCDE1234F)');

const aadhaarNumberSchema = z
  .string()
  .trim()
  .refine((value) => /^\d{4}\s?\d{4}\s?\d{4}$/.test(value.replace(/-/g, '')), {
    message: 'Enter a valid 12-digit Aadhaar number',
  });

const acceptJobTermsSchema = z.boolean().refine((value) => value === true, {
  message: 'Please accept the Job Application Terms & Conditions to continue',
});

const acceptInternshipTermsSchema = z.boolean().refine((value) => value === true, {
  message: 'Please accept the Internship Terms & Conditions to continue',
});

const resumeSchema = z
  .custom<FileList | File | undefined>((value) => Boolean(getResumeFile(value)), {
    message: 'Resume is required',
  })
  .refine((value) => hasAllowedResume(value), {
    message: `Upload a PDF, DOC, or DOCX file up to ${MAX_RESUME_BYTES / (1024 * 1024)}MB`,
  });

export const JOB_EXPERIENCE_VALUES = ['0-2', '3-5', '5+'] as const;

export type JobExperienceValue = (typeof JOB_EXPERIENCE_VALUES)[number];

export const JOB_EXPERIENCE_OPTIONS = [
  { value: '0-2', label: '0-2 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5+', label: '5+ years' },
] as const;

export function experienceOptionLabel(value: JobExperienceValue): string {
  return JOB_EXPERIENCE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

/** Map a posted job experience string onto the apply-form bands. */
export function parsePostedExperience(posted: string): JobExperienceValue | null {
  const compact = posted.trim().toLowerCase().replace(/–/g, '-').replace(/\s+/g, '');
  if (!compact) return null;

  if (compact.includes('5+')) return '5+';
  if (compact.startsWith('0-2') || compact.includes('0-2year')) return '0-2';
  if (compact.startsWith('3-5') || compact.includes('3-5year')) return '3-5';

  const range = compact.match(/(\d+)\s*-\s*(\d+)/);
  if (range) {
    const mid = (Number(range[1]) + Number(range[2])) / 2;
    if (mid <= 2) return '0-2';
    if (mid <= 5) return '3-5';
    return '5+';
  }

  const minPlus = compact.match(/(\d+)\+/);
  if (minPlus && Number(minPlus[1]) >= 5) return '5+';

  return null;
}

export function experienceMatchesJob(posted: string, selected: string): boolean {
  const required = parsePostedExperience(posted);
  if (!required) return true;
  return selected === required;
}

export function jobExperienceMismatchMessage(posted: string): string {
  const required = parsePostedExperience(posted);
  const label = required ? experienceOptionLabel(required) : posted;
  return `Your years of experience do not match this role. This job requires ${label}.`;
}

export const jobApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number').max(20),
  location: z.string().min(2, 'Location is required'),
  education: z.string().min(2, 'Education is required'),
  experience: z.enum(JOB_EXPERIENCE_VALUES, {
    errorMap: () => ({ message: 'Select years of experience' }),
  }),
  skills: z.string().min(2, 'Skills are required'),
  linkedin: z
    .string()
    .url('Enter a valid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  portfolio: z
    .string()
    .url('Enter a valid portfolio URL')
    .optional()
    .or(z.literal('')),
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters'),
  panNumber: panNumberSchema,
  aadhaarNumber: aadhaarNumberSchema,
  acceptTerms: acceptJobTermsSchema,
  resume: resumeSchema,
});

export type JobApplicationValues = z.infer<typeof jobApplicationSchema>;

export function createJobApplicationSchema(postedExperience: string) {
  return jobApplicationSchema.superRefine((data, ctx) => {
    if (!experienceMatchesJob(postedExperience, data.experience)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['experience'],
        message: jobExperienceMismatchMessage(postedExperience),
      });
    }
  });
}

export const internshipApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number').max(20),
  college: z.string().min(2, 'College / university is required'),
  course: z.string().min(2, 'Course is required'),
  year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Year must be a 4-digit number (e.g. 2026)'),
  skills: z.string().min(2, 'Skills are required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  panNumber: panNumberSchema,
  aadhaarNumber: aadhaarNumberSchema,
  acceptTerms: acceptInternshipTermsSchema,
  resume: resumeSchema,
});

export type InternshipApplicationValues = z.infer<typeof internshipApplicationSchema>;

export const requestDemoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number').max(20),
  company: z.string().min(2, 'Company is required'),
  project: z.string().min(1, 'Select a project'),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  message: z.string().optional(),
});

export type RequestDemoValues = z.infer<typeof requestDemoSchema>;
