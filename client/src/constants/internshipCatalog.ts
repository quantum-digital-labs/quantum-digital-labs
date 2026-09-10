export const INTERNSHIP_DOMAIN_OPTIONS = [
  'Engineering',
  'Marketing',
  'Data',
  'Design',
  'Business',
  'Other',
] as const;

export const INTERNSHIP_MODE_OPTIONS = [
  'Online / Hybrid',
  'Online',
  'Hybrid',
  'On-site',
] as const;

export const INTERNSHIP_DURATION_OPTIONS = [
  '4–6 weeks',
  '6–10 weeks',
  '8–12 weeks',
  '3 months',
  'Custom',
] as const;

export const INTERNSHIP_WORK_MODE_OPTIONS = [
  'Remote',
  'Hybrid',
  'On-site',
] as const;

export function paragraphToList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToParagraph(items: string[] | undefined): string {
  return (items ?? []).join('\n');
}
