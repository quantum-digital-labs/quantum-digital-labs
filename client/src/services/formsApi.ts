import { supabase } from '../lib/supabaseClient';
import type {
  InternshipApplicationValues,
  JobApplicationValues,
  RequestDemoValues,
} from '../validations';
import type { ContactFormValues } from '../validations/contact';
import type { QuoteFormValues } from '../validations/quote';

interface SubmitResult {
  referenceNumber: string;
  id: string;
}

function createReferenceNumber(prefix: string): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

function isUniqueViolation(error: unknown): boolean {
  return !!error && typeof error === 'object' && (error as { code?: string }).code === '23505';
}

function resumeFile(resume: FileList | File | undefined): File {
  const file = resume instanceof File ? resume : resume instanceof FileList ? resume[0] : undefined;
  if (!file) throw new Error('Resume is required');
  return file;
}

async function requireUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error('Authentication required');
  return data.user.id;
}

/** Uploads a resume to the private `resumes` bucket under the user's own
 * folder (required by the bucket's Storage RLS policy) and returns the
 * object path to store on the application row. */
async function uploadResume(userId: string, file: File): Promise<{ path: string; name: string }> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${userId}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from('resumes').upload(path, file, {
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  return { path, name: file.name };
}

async function resolveTitle(table: 'jobs' | 'internships', id: string): Promise<string> {
  const { data } = await supabase.from(table).select('title').eq('id', id).single();
  return (data?.title as string | undefined) ?? id;
}

export async function submitJobApplication(
  jobId: string,
  values: JobApplicationValues,
): Promise<SubmitResult> {
  const userId = await requireUserId();
  const file = resumeFile(values.resume);
  const [title, resume] = await Promise.all([
    resolveTitle('jobs', jobId),
    uploadResume(userId, file),
  ]);

  const referenceNumber = createReferenceNumber('JOB');
  const email = values.email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      reference_number: referenceNumber,
      user_id: userId,
      job_id: jobId,
      title,
      full_name: values.fullName,
      email,
      phone: values.phone,
      location: values.location,
      education: values.education,
      experience: values.experience,
      skills: values.skills,
      linkedin: values.linkedin ?? null,
      portfolio: values.portfolio ?? null,
      cover_letter: values.coverLetter,
      pan_number: values.panNumber,
      aadhaar_number: values.aadhaarNumber,
      accept_terms: values.acceptTerms,
      resume_file_name: resume.name,
      resume_path: resume.path,
      status: 'received',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(isUniqueViolation(error) ? 'You have already applied for this job' : error.message);
  }

  // Email notifications are sent asynchronously by a DB webhook -> Edge
  // Function on INSERT (see supabase/functions/notify-application).
  return { id: data.id, referenceNumber };
}

export async function submitInternshipApplication(
  internshipId: string,
  values: InternshipApplicationValues,
): Promise<SubmitResult> {
  const userId = await requireUserId();
  const file = resumeFile(values.resume);
  const [title, resume] = await Promise.all([
    resolveTitle('internships', internshipId),
    uploadResume(userId, file),
  ]);

  const referenceNumber = createReferenceNumber('INT');
  const email = values.email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('internship_applications')
    .insert({
      reference_number: referenceNumber,
      user_id: userId,
      internship_id: internshipId,
      title,
      full_name: values.fullName,
      email,
      phone: values.phone,
      college: values.college,
      course: values.course,
      year: values.year,
      skills: values.skills,
      message: values.message,
      pan_number: values.panNumber,
      aadhaar_number: values.aadhaarNumber,
      accept_terms: values.acceptTerms,
      resume_file_name: resume.name,
      resume_path: resume.path,
      status: 'received',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(
      isUniqueViolation(error) ? 'You have already applied for this internship' : error.message,
    );
  }

  return { id: data.id, referenceNumber };
}

async function insertInquiry(input: {
  type: 'contact' | 'quote' | 'demo';
  prefix: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  message?: string;
  budget?: string;
  requirements?: string;
  timeline?: string;
  project?: string;
  preferredDate?: string;
}): Promise<SubmitResult> {
  const { data: userData } = await supabase.auth.getUser();
  const referenceNumber = createReferenceNumber(input.prefix);
  const email = input.email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      reference_number: referenceNumber,
      type: input.type,
      name: input.name.trim(),
      email,
      phone: input.phone.trim(),
      company: input.company?.trim() || null,
      service: input.service?.trim() || null,
      message: input.message?.trim() || null,
      budget: input.budget?.trim() || null,
      requirements: input.requirements?.trim() || null,
      timeline: input.timeline?.trim() || null,
      project: input.project?.trim() || null,
      preferred_date: input.preferredDate?.trim() || null,
      user_id: userData.user?.id ?? null,
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id, referenceNumber };
}

export async function submitContact(values: ContactFormValues): Promise<SubmitResult> {
  return insertInquiry({
    type: 'contact',
    prefix: 'QDLCT',
    name: values.name,
    email: values.email,
    phone: values.phone,
    company: values.company,
    service: values.service,
    message: values.message,
  });
}

export async function submitQuote(values: QuoteFormValues): Promise<SubmitResult> {
  return insertInquiry({
    type: 'quote',
    prefix: 'QDLQT',
    name: values.name,
    email: values.email,
    phone: values.phone,
    company: values.company,
    service: values.service,
    budget: values.budget,
    requirements: values.requirements,
    timeline: values.timeline,
  });
}

export async function submitDemo(values: RequestDemoValues): Promise<SubmitResult> {
  return insertInquiry({
    type: 'demo',
    prefix: 'QDLDM',
    name: values.name,
    email: values.email,
    phone: values.phone,
    company: values.company,
    project: values.project,
    requirements: values.requirements,
    preferredDate: values.preferredDate,
    message: values.message,
  });
}

export type JobApplicationStatus = 'received' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';

export interface TrackedJobApplication {
  jobId: string;
  referenceNumber: string;
  status: JobApplicationStatus;
  appliedAt: string;
  resumeFileName?: string;
}

export type InternshipApplicationStatus =
  | 'received'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'selected';

export interface TrackedInternshipApplication {
  internshipId: string;
  referenceNumber: string;
  status: InternshipApplicationStatus;
  appliedAt: string;
  resumeFileName?: string;
}

export interface MyApplications {
  jobIds: string[];
  internshipIds: string[];
  jobs?: TrackedJobApplication[];
  internships?: TrackedInternshipApplication[];
}

/** One row per job/internship (most recent), for the signed-in user. */
export async function fetchMyApplications(): Promise<MyApplications> {
  const [jobsRes, internshipsRes] = await Promise.all([
    supabase
      .from('job_applications')
      .select('job_id, reference_number, status, created_at, resume_file_name')
      .order('created_at', { ascending: false }),
    supabase
      .from('internship_applications')
      .select('internship_id, reference_number, status, created_at, resume_file_name')
      .order('created_at', { ascending: false }),
  ]);
  if (jobsRes.error) throw new Error(jobsRes.error.message);
  if (internshipsRes.error) throw new Error(internshipsRes.error.message);

  const seenJobs = new Set<string>();
  const jobs: TrackedJobApplication[] = [];
  for (const row of (jobsRes.data ?? []) as Record<string, unknown>[]) {
    const jobId = row.job_id as string;
    if (seenJobs.has(jobId)) continue;
    seenJobs.add(jobId);
    jobs.push({
      jobId,
      referenceNumber: row.reference_number as string,
      status: row.status as JobApplicationStatus,
      appliedAt: row.created_at as string,
      resumeFileName: (row.resume_file_name as string | null) ?? undefined,
    });
  }

  const seenInternships = new Set<string>();
  const internships: TrackedInternshipApplication[] = [];
  for (const row of (internshipsRes.data ?? []) as Record<string, unknown>[]) {
    const internshipId = row.internship_id as string;
    if (seenInternships.has(internshipId)) continue;
    seenInternships.add(internshipId);
    internships.push({
      internshipId,
      referenceNumber: row.reference_number as string,
      status: row.status as InternshipApplicationStatus,
      appliedAt: row.created_at as string,
      resumeFileName: (row.resume_file_name as string | null) ?? undefined,
    });
  }

  return {
    jobIds: jobs.map((j) => j.jobId),
    internshipIds: internships.map((i) => i.internshipId),
    jobs,
    internships,
  };
}

export interface AdminApplicationRow {
  referenceNumber: string;
  status: string;
  appliedAt: string;
  fullName: string;
  email: string;
  title: string;
  jobId?: string;
  internshipId?: string;
}

export interface AdminApplications {
  jobs: AdminApplicationRow[];
  internships: AdminApplicationRow[];
}

export async function fetchAdminApplications(): Promise<AdminApplications> {
  const [jobsRes, internshipsRes] = await Promise.all([
    supabase
      .from('job_applications')
      .select('reference_number, status, created_at, full_name, email, title, job_id')
      .order('created_at', { ascending: false }),
    supabase
      .from('internship_applications')
      .select('reference_number, status, created_at, full_name, email, title, internship_id')
      .order('created_at', { ascending: false }),
  ]);
  if (jobsRes.error) throw new Error(jobsRes.error.message);
  if (internshipsRes.error) throw new Error(internshipsRes.error.message);

  return {
    jobs: ((jobsRes.data ?? []) as Record<string, unknown>[]).map((row) => ({
      referenceNumber: row.reference_number as string,
      status: row.status as string,
      appliedAt: row.created_at as string,
      fullName: row.full_name as string,
      email: row.email as string,
      title: row.title as string,
      jobId: row.job_id as string,
    })),
    internships: ((internshipsRes.data ?? []) as Record<string, unknown>[]).map((row) => ({
      referenceNumber: row.reference_number as string,
      status: row.status as string,
      appliedAt: row.created_at as string,
      fullName: row.full_name as string,
      email: row.email as string,
      title: row.title as string,
      internshipId: row.internship_id as string,
    })),
  };
}

export async function updateJobApplicationStatus(
  referenceNumber: string,
  status: JobApplicationStatus,
): Promise<{ referenceNumber: string; status: JobApplicationStatus; emailed: boolean }> {
  const { error } = await supabase
    .from('job_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('reference_number', referenceNumber);
  if (error) throw new Error(error.message);
  // Status-change emails are sent asynchronously by a DB webhook -> Edge Function.
  return { referenceNumber, status, emailed: true };
}

export async function updateInternshipApplicationStatus(
  referenceNumber: string,
  status: InternshipApplicationStatus,
): Promise<{ referenceNumber: string; status: InternshipApplicationStatus; emailed: boolean }> {
  const { error } = await supabase
    .from('internship_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('reference_number', referenceNumber);
  if (error) throw new Error(error.message);
  return { referenceNumber, status, emailed: true };
}
