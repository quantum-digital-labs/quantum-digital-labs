export const JOB_EXPERIENCE_OPTIONS = [
  '0-2 years',
  '3-5 years',
  '5+ years',
] as const;

export const JOB_TYPE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
] as const;

export const JOB_DEPARTMENT_OPTIONS = [
  'Engineering',
  'Marketing',
  'People & Talent',
  'Operations',
  'Sales',
] as const;

export const JOB_LOCATION_OPTIONS = [
  'Remote / Hybrid',
  'On-site / Hybrid',
  'Hybrid',
  'Remote',
  'On-site',
] as const;

export const JOB_WORK_MODE_OPTIONS = [
  'Remote',
  'Hybrid',
  'On-site',
] as const;

export function slugifyJobId(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function paragraphToList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToParagraph(items: string[] | undefined): string {
  return (items ?? []).join('\n');
}
