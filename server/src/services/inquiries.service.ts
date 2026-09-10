import type { SubmitResult } from '../types';
import { assertDatabaseReady } from '../utils/databaseGate';

export interface ContactInquiryInput {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
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
}

export async function createContactInquiry(
  _input: ContactInquiryInput,
): Promise<SubmitResult> {
  assertDatabaseReady();
}

export async function createQuoteInquiry(
  _input: QuoteInquiryInput,
): Promise<SubmitResult> {
  assertDatabaseReady();
}

export async function createDemoInquiry(
  _input: DemoInquiryInput,
): Promise<SubmitResult> {
  assertDatabaseReady();
}
