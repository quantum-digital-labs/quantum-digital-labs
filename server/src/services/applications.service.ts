import { getPool } from '../db/pool';
import type {
  InternshipApplicationStatus,
  JobApplicationStatus,
  SubmitResult,
} from '../types';
import { AppError } from '../utils/AppError';
import {
  sendApplicationStatusEmail,
  sendInternshipApplicationEmail,
  sendJobApplicationEmail,
} from '../utils/emailTemplates';
import { createReferenceNumber } from '../utils/referenceNumber';

export interface JobApplicationInput {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  experience: string;
  skills: string;
  linkedin?: string;
  portfolio?: string;
  coverLetter: string;
  panNumber: string;
  aadhaarNumber: string;
  acceptTerms: boolean;
  resumeFileName?: string;
  resumePath?: string;
  userId?: string;
}

export interface InternshipApplicationInput {
  internshipId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  skills: string;
  message: string;
  panNumber: string;
  aadhaarNumber: string;
  acceptTerms: boolean;
  resumeFileName?: string;
  resumePath?: string;
  userId?: string;
}

export interface MyApplicationsResult {
  jobIds: string[];
  internshipIds: string[];
  jobs?: Array<{
    jobId: string;
    referenceNumber: string;
    status: JobApplicationStatus;
    appliedAt: string;
    resumeFileName?: string;
  }>;
  internships?: Array<{
    internshipId: string;
    referenceNumber: string;
    status: InternshipApplicationStatus;
    appliedAt: string;
    resumeFileName?: string;
  }>;
}

export interface AdminApplicationsResult {
  jobs: Array<{
    referenceNumber: string;
    status: string;
    appliedAt: string;
    fullName: string;
    email: string;
    title: string;
    jobId?: string;
  }>;
  internships: Array<{
    referenceNumber: string;
    status: string;
    appliedAt: string;
    fullName: string;
    email: string;
    title: string;
    internshipId?: string;
  }>;
}

async function resolveJobTitle(jobId: string): Promise<string> {
  const pool = getPool();
  const result = await pool.query<{ title: string }>(
    `SELECT title FROM jobs WHERE id = $1`,
    [jobId],
  );
  return result.rows[0]?.title ?? jobId;
}

async function resolveInternshipTitle(internshipId: string): Promise<string> {
  const pool = getPool();
  const result = await pool.query<{ title: string }>(
    `SELECT title FROM internships WHERE id = $1`,
    [internshipId],
  );
  return result.rows[0]?.title ?? internshipId;
}

export async function createJobApplication(
  input: JobApplicationInput,
): Promise<SubmitResult> {
  const pool = getPool();
  const email = input.email.trim().toLowerCase();
  const title = await resolveJobTitle(input.jobId);
  const referenceNumber = createReferenceNumber('JOB');

  if (input.userId) {
    const duplicate = await pool.query(
      `SELECT id FROM job_applications WHERE user_id = $1 AND job_id = $2`,
      [input.userId, input.jobId],
    );
    if (duplicate.rowCount && duplicate.rowCount > 0) {
      throw new AppError('You have already applied for this job', 409);
    }
  }

  const inserted = await pool.query<{ id: string }>(
    `INSERT INTO job_applications (
       reference_number, user_id, job_id, title, full_name, email, phone,
       location, education, experience, skills, linkedin, portfolio,
       cover_letter, pan_number, aadhaar_number, accept_terms,
       resume_file_name, resume_path, status
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       $8, $9, $10, $11, $12, $13,
       $14, $15, $16, $17,
       $18, $19, 'received'
     )
     RETURNING id`,
    [
      referenceNumber,
      input.userId ?? null,
      input.jobId,
      title,
      input.fullName,
      email,
      input.phone,
      input.location,
      input.education,
      input.experience,
      input.skills,
      input.linkedin ?? null,
      input.portfolio ?? null,
      input.coverLetter,
      input.panNumber,
      input.aadhaarNumber,
      input.acceptTerms,
      input.resumeFileName ?? null,
      input.resumePath ?? null,
    ],
  );

  await sendJobApplicationEmail({
    email,
    fullName: input.fullName,
    jobTitle: title,
    referenceNumber,
  });

  return {
    id: inserted.rows[0].id,
    referenceNumber,
  };
}

export async function createInternshipApplication(
  input: InternshipApplicationInput,
): Promise<SubmitResult> {
  const pool = getPool();
  const email = input.email.trim().toLowerCase();
  const title = await resolveInternshipTitle(input.internshipId);
  const referenceNumber = createReferenceNumber('INT');

  if (input.userId) {
    const duplicate = await pool.query(
      `SELECT id FROM internship_applications
       WHERE user_id = $1 AND internship_id = $2`,
      [input.userId, input.internshipId],
    );
    if (duplicate.rowCount && duplicate.rowCount > 0) {
      throw new AppError('You have already applied for this internship', 409);
    }
  }

  const inserted = await pool.query<{ id: string }>(
    `INSERT INTO internship_applications (
       reference_number, user_id, internship_id, title, full_name, email, phone,
       college, course, year, skills, message, pan_number, aadhaar_number,
       accept_terms, resume_file_name, resume_path, status
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       $8, $9, $10, $11, $12, $13, $14,
       $15, $16, $17, 'received'
     )
     RETURNING id`,
    [
      referenceNumber,
      input.userId ?? null,
      input.internshipId,
      title,
      input.fullName,
      email,
      input.phone,
      input.college,
      input.course,
      input.year,
      input.skills,
      input.message,
      input.panNumber,
      input.aadhaarNumber,
      input.acceptTerms,
      input.resumeFileName ?? null,
      input.resumePath ?? null,
    ],
  );

  await sendInternshipApplicationEmail({
    email,
    fullName: input.fullName,
    internshipTitle: title,
    referenceNumber,
  });

  return {
    id: inserted.rows[0].id,
    referenceNumber,
  };
}

export async function getMyApplications(
  userId: string,
  email?: string,
): Promise<MyApplicationsResult> {
  const pool = getPool();
  const normalizedEmail = email?.trim().toLowerCase() ?? null;

  const jobs = await pool.query<{
    job_id: string;
    reference_number: string;
    status: JobApplicationStatus;
    created_at: Date;
    resume_file_name: string | null;
  }>(
    `SELECT DISTINCT ON (job_id)
       job_id, reference_number, status, created_at, resume_file_name
     FROM job_applications
     WHERE user_id = $1
        OR ($2::text IS NOT NULL AND lower(email) = $2)
     ORDER BY job_id, created_at DESC`,
    [userId, normalizedEmail],
  );

  const internships = await pool.query<{
    internship_id: string;
    reference_number: string;
    status: InternshipApplicationStatus;
    created_at: Date;
    resume_file_name: string | null;
  }>(
    `SELECT DISTINCT ON (internship_id)
       internship_id, reference_number, status, created_at, resume_file_name
     FROM internship_applications
     WHERE user_id = $1
        OR ($2::text IS NOT NULL AND lower(email) = $2)
     ORDER BY internship_id, created_at DESC`,
    [userId, normalizedEmail],
  );

  const jobRows = jobs.rows
    .map((row) => ({
      jobId: row.job_id,
      referenceNumber: row.reference_number,
      status: row.status,
      appliedAt: row.created_at.toISOString(),
      resumeFileName: row.resume_file_name ?? undefined,
    }))
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));

  const internshipRows = internships.rows
    .map((row) => ({
      internshipId: row.internship_id,
      referenceNumber: row.reference_number,
      status: row.status,
      appliedAt: row.created_at.toISOString(),
      resumeFileName: row.resume_file_name ?? undefined,
    }))
    .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));

  return {
    jobIds: jobRows.map((row) => row.jobId),
    internshipIds: internshipRows.map((row) => row.internshipId),
    jobs: jobRows,
    internships: internshipRows,
  };
}

export async function getAdminApplications(): Promise<AdminApplicationsResult> {
  const pool = getPool();

  const jobs = await pool.query<{
    reference_number: string;
    status: string;
    created_at: Date;
    full_name: string;
    email: string;
    title: string;
    job_id: string;
  }>(
    `SELECT reference_number, status, created_at, full_name, email, title, job_id
     FROM job_applications
     ORDER BY created_at DESC`,
  );

  const internships = await pool.query<{
    reference_number: string;
    status: string;
    created_at: Date;
    full_name: string;
    email: string;
    title: string;
    internship_id: string;
  }>(
    `SELECT reference_number, status, created_at, full_name, email, title, internship_id
     FROM internship_applications
     ORDER BY created_at DESC`,
  );

  return {
    jobs: jobs.rows.map((row) => ({
      referenceNumber: row.reference_number,
      status: row.status,
      appliedAt: row.created_at.toISOString(),
      fullName: row.full_name,
      email: row.email,
      title: row.title,
      jobId: row.job_id,
    })),
    internships: internships.rows.map((row) => ({
      referenceNumber: row.reference_number,
      status: row.status,
      appliedAt: row.created_at.toISOString(),
      fullName: row.full_name,
      email: row.email,
      title: row.title,
      internshipId: row.internship_id,
    })),
  };
}

export async function updateJobStatus(
  referenceNumber: string,
  status: JobApplicationStatus,
): Promise<{ referenceNumber: string; status: JobApplicationStatus; emailed: boolean }> {
  const pool = getPool();
  const result = await pool.query<{
    reference_number: string;
    status: JobApplicationStatus;
    email: string;
    full_name: string;
    title: string;
  }>(
    `UPDATE job_applications
     SET status = $1, updated_at = NOW()
     WHERE reference_number = $2
     RETURNING reference_number, status, email, full_name, title`,
    [status, referenceNumber],
  );

  const row = result.rows[0];
  if (!row) {
    throw new AppError('Job application not found', 404);
  }

  const emailed = await sendApplicationStatusEmail({
    email: row.email,
    fullName: row.full_name,
    title: row.title,
    referenceNumber: row.reference_number,
    status: row.status,
    kind: 'job',
  });

  return {
    referenceNumber: row.reference_number,
    status: row.status,
    emailed,
  };
}

export async function updateInternshipStatus(
  referenceNumber: string,
  status: InternshipApplicationStatus,
): Promise<{
  referenceNumber: string;
  status: InternshipApplicationStatus;
  emailed: boolean;
}> {
  const pool = getPool();
  const result = await pool.query<{
    reference_number: string;
    status: InternshipApplicationStatus;
    email: string;
    full_name: string;
    title: string;
  }>(
    `UPDATE internship_applications
     SET status = $1, updated_at = NOW()
     WHERE reference_number = $2
     RETURNING reference_number, status, email, full_name, title`,
    [status, referenceNumber],
  );

  const row = result.rows[0];
  if (!row) {
    throw new AppError('Internship application not found', 404);
  }

  const emailed = await sendApplicationStatusEmail({
    email: row.email,
    fullName: row.full_name,
    title: row.title,
    referenceNumber: row.reference_number,
    status: row.status,
    kind: 'internship',
  });

  return {
    referenceNumber: row.reference_number,
    status: row.status,
    emailed,
  };
}
