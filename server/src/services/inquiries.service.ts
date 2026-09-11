import { getPool } from '../db/pool';
import type { SubmitResult } from '../types';
import { assertDatabaseReady } from '../utils/databaseGate';
import { sendInquiryReceivedEmail } from '../utils/emailTemplates';
import { createReferenceNumber } from '../utils/referenceNumber';

export interface ContactInquiryInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
  userId?: string;
}

export interface QuoteInquiryInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget?: string;
  requirements: string;
  timeline?: string;
  userId?: string;
}

export interface DemoInquiryInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  project: string;
  requirements: string;
  preferredDate: string;
  message?: string;
  userId?: string;
}

type InquiryType = 'contact' | 'quote' | 'demo';

interface InquiryRow {
  id: string;
  reference_number: string;
}

async function insertInquiry(input: {
  type: InquiryType;
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
  userId?: string;
}): Promise<SubmitResult> {
  assertDatabaseReady();

  const pool = getPool();
  const referenceNumber = createReferenceNumber(input.prefix);
  const email = input.email.trim().toLowerCase();

  const result = await pool.query<InquiryRow>(
    `INSERT INTO inquiries (
       reference_number, type, name, email, phone, company, service,
       message, budget, requirements, timeline, project, preferred_date, user_id
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       $8, $9, $10, $11, $12, $13, $14
     )
     RETURNING id, reference_number`,
    [
      referenceNumber,
      input.type,
      input.name.trim(),
      email,
      input.phone.trim(),
      input.company?.trim() || null,
      input.service?.trim() || null,
      input.message?.trim() || null,
      input.budget?.trim() || null,
      input.requirements?.trim() || null,
      input.timeline?.trim() || null,
      input.project?.trim() || null,
      input.preferredDate?.trim() || null,
      input.userId ?? null,
    ],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Failed to create inquiry');
  }

  await sendInquiryReceivedEmail({
    email,
    name: input.name.trim(),
    type: input.type,
    referenceNumber: row.reference_number,
  });

  return {
    id: row.id,
    referenceNumber: row.reference_number,
  };
}

export async function createContactInquiry(
  input: ContactInquiryInput,
): Promise<SubmitResult> {
  return insertInquiry({
    type: 'contact',
    prefix: 'QDLCT',
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    service: input.service,
    message: input.message,
    userId: input.userId,
  });
}

export async function createQuoteInquiry(
  input: QuoteInquiryInput,
): Promise<SubmitResult> {
  return insertInquiry({
    type: 'quote',
    prefix: 'QDLQT',
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    service: input.service,
    budget: input.budget,
    requirements: input.requirements,
    timeline: input.timeline,
    userId: input.userId,
  });
}

export async function createDemoInquiry(
  input: DemoInquiryInput,
): Promise<SubmitResult> {
  return insertInquiry({
    type: 'demo',
    prefix: 'QDLDM',
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    project: input.project,
    requirements: input.requirements,
    preferredDate: input.preferredDate,
    message: input.message,
    userId: input.userId,
  });
}
