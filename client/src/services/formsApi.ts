import { apiClient } from './apiClient';
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

function appendResume(form: FormData, resume: FileList | File | undefined) {
  const file =
    resume instanceof File
      ? resume
      : resume instanceof FileList
        ? resume[0]
        : undefined;
  if (!file) {
    throw new Error('Resume is required');
  }
  form.append('resume', file);
}

export async function submitJobApplication(
  jobId: string,
  values: JobApplicationValues,
): Promise<SubmitResult> {
  const form = new FormData();
  form.append('jobId', jobId);
  form.append('fullName', values.fullName);
  form.append('email', values.email);
  form.append('phone', values.phone);
  form.append('location', values.location);
  form.append('education', values.education);
  form.append('experience', values.experience);
  form.append('skills', values.skills);
  form.append('linkedin', values.linkedin ?? '');
  form.append('portfolio', values.portfolio ?? '');
  form.append('coverLetter', values.coverLetter);
  form.append('panNumber', values.panNumber);
  form.append('aadhaarNumber', values.aadhaarNumber);
  form.append('acceptTerms', String(values.acceptTerms));
  appendResume(form, values.resume);

  const { data } = await apiClient.post<SubmitResult>('/applications/jobs', form);
  return data;
}

export async function submitInternshipApplication(
  internshipId: string,
  values: InternshipApplicationValues,
): Promise<SubmitResult> {
  const form = new FormData();
  form.append('internshipId', internshipId);
  form.append('fullName', values.fullName);
  form.append('email', values.email);
  form.append('phone', values.phone);
  form.append('college', values.college);
  form.append('course', values.course);
  form.append('year', values.year);
  form.append('skills', values.skills);
  form.append('message', values.message);
  form.append('panNumber', values.panNumber);
  form.append('aadhaarNumber', values.aadhaarNumber);
  form.append('acceptTerms', String(values.acceptTerms));
  appendResume(form, values.resume);

  const { data } = await apiClient.post<SubmitResult>(
    '/applications/internships',
    form,
  );
  return data;
}

export async function submitContact(
  values: ContactFormValues,
): Promise<SubmitResult> {
  const { data } = await apiClient.post<SubmitResult>('/inquiries/contact', values);
  return data;
}

export async function submitQuote(values: QuoteFormValues): Promise<SubmitResult> {
  const { data } = await apiClient.post<SubmitResult>('/inquiries/quote', values);
  return data;
}

export type JobApplicationStatus =
  | 'received'
  | 'reviewing'
  | 'shortlisted'
  | 'rejected'
  | 'hired';

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

export async function fetchMyApplications(): Promise<MyApplications> {
  const { data } = await apiClient.get<MyApplications>('/applications/mine');
  return data;
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
  const { data } = await apiClient.get<AdminApplications>('/applications/admin');
  return data;
}

export async function updateJobApplicationStatus(
  referenceNumber: string,
  status: JobApplicationStatus,
): Promise<{ referenceNumber: string; status: JobApplicationStatus; emailed: boolean }> {
  const { data } = await apiClient.patch(
    `/applications/jobs/${encodeURIComponent(referenceNumber)}/status`,
    { status },
  );
  return data;
}

export async function updateInternshipApplicationStatus(
  referenceNumber: string,
  status: InternshipApplicationStatus,
): Promise<{
  referenceNumber: string;
  status: InternshipApplicationStatus;
  emailed: boolean;
}> {
  const { data } = await apiClient.patch(
    `/applications/internships/${encodeURIComponent(referenceNumber)}/status`,
    { status },
  );
  return data;
}

export async function submitDemo(values: RequestDemoValues): Promise<SubmitResult> {
  const { data } = await apiClient.post<SubmitResult>('/inquiries/demo', values);
  return data;
}
