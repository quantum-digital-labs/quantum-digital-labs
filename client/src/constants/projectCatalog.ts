export const PROJECT_CATEGORY_OPTIONS = [
  'Web Application',
  'HR Tech / Web',
  'Learning Platform',
  'Digital Marketing',
  'Cloud / DevOps',
  'Mobile',
  'Other',
] as const;

export const PROJECT_STATUS_OPTIONS = [
  'Live concept delivery',
  'Demo-ready',
  'Concept / demo',
  'In progress',
  'Completed',
  'Other',
] as const;

export const PROJECT_TIMELINE_OPTIONS = [
  '4–6 weeks',
  '6–8 weeks',
  '6–10 weeks',
  '8–10 weeks',
  '8–12 weeks',
  '10–12 weeks',
  '10–14 weeks',
  '12–16 weeks',
  'Custom',
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
