import { COMPANY } from './company';

export const JOB_APPLICATION_TERMS_TITLE = 'Job Application – Terms & Conditions';

export const JOB_APPLICATION_TERMS_INTRO = `By submitting a job application to ${COMPANY.legalName}, you agree to the following:`;

export const JOB_APPLICATION_TERMS = [
  {
    title: 'Accurate Information',
    body: 'All information and documents provided must be true, complete, and accurate.',
  },
  {
    title: 'Document Verification',
    body: 'The Company reserves the right to verify educational qualifications, employment history, experience, identity, and other submitted information.',
  },
  {
    title: 'False Information',
    body: 'Submission of false, misleading, forged, or fraudulent information/documents may result in immediate disqualification or withdrawal of an employment offer.',
  },
  {
    title: 'Recruitment Process',
    body: 'The Company may conduct interviews, technical assessments, background verification, and other evaluations as required.',
  },
  {
    title: 'No Guarantee',
    body: 'Applying for a position or attending an interview does not guarantee selection or employment.',
  },
  {
    title: 'Professional Conduct',
    body: 'Candidates must maintain professional and respectful conduct throughout the recruitment process.',
  },
  {
    title: 'Confidentiality',
    body: 'Candidates must not disclose, copy, or misuse confidential Company information, interview materials, or assessment content.',
  },
  {
    title: 'Data & Privacy',
    body: "Candidate information may be collected and processed for recruitment purposes in accordance with the Company's Privacy Policy and applicable laws.",
  },
  {
    title: 'Recruitment Fees',
    body: 'The Company does not authorize anyone to demand payment in exchange for a job, interview, or employment opportunity.',
  },
  {
    title: 'Job Changes',
    body: 'The Company reserves the right to modify, suspend, or withdraw job vacancies and recruitment processes based on business requirements.',
  },
  {
    title: 'Candidate Declaration',
    body: 'By applying, you confirm that the information provided is genuine and agree to these Terms & Conditions.',
  },
] as const;

export const JOB_APPLICATION_TERMS_CHECKBOX =
  'I have read and agree to the Job Application Terms & Conditions.';
