import { COMPANY } from './company';

export const INTERNSHIP_APPLICATION_TERMS_TITLE = 'Internship – Terms & Conditions';

export const INTERNSHIP_APPLICATION_TERMS_INTRO = `By applying for an internship with ${COMPANY.legalName}, you agree to the following:`;

export const INTERNSHIP_APPLICATION_TERMS = [
  {
    title: 'Accurate Information',
    body: 'All information and documents submitted must be true, complete, and accurate.',
  },
  {
    title: 'Eligibility',
    body: 'Interns must meet the eligibility criteria specified for the respective internship program.',
  },
  {
    title: 'Selection Process',
    body: 'Selection may include resume screening, interviews, assignments, assessments, or technical evaluations.',
  },
  {
    title: 'No Guarantee',
    body: 'Applying for or participating in an internship selection process does not guarantee selection, completion, or future employment.',
  },
  {
    title: 'Professional Conduct',
    body: 'Interns must maintain professional, respectful, and ethical behavior throughout the internship.',
  },
  {
    title: 'Attendance & Responsibilities',
    body: 'Interns are expected to follow assigned working hours, attendance requirements, deadlines, and responsibilities.',
  },
  {
    title: 'Confidentiality',
    body: 'Interns must not disclose, copy, distribute, or misuse confidential Company, client, employee, or project information.',
  },
  {
    title: 'Company Property',
    body: 'Company equipment, credentials, documents, software, and other resources must be used responsibly and returned when requested.',
  },
  {
    title: 'Intellectual Property',
    body: "Work, materials, code, designs, documentation, or other deliverables created as part of the internship will be subject to the Company's applicable intellectual-property policies and agreements.",
  },
  {
    title: 'False Information',
    body: 'Providing false information or forged documents may result in immediate termination of the internship.',
  },
  {
    title: 'Data & Privacy',
    body: "Information collected during the internship process will be handled in accordance with the Company's Privacy Policy and applicable laws.",
  },
  {
    title: 'Internship Changes',
    body: 'The Company reserves the right to modify, suspend, or discontinue an internship program based on business requirements.',
  },
  {
    title: 'Recruitment Fees',
    body: 'The Company does not authorize anyone to demand payment in exchange for an internship opportunity.',
  },
  {
    title: 'Intern Declaration',
    body: 'By applying, you confirm that the information provided is genuine and agree to comply with these Terms & Conditions.',
  },
] as const;

export const INTERNSHIP_APPLICATION_TERMS_CHECKBOX =
  'I have read and agree to the Internship Terms & Conditions.';

export const INTERNSHIP_APPLICATION_TERMS_LINK_LABEL =
  'Internship Terms & Conditions';
