export const PORTFOLIO_CATEGORY_OPTIONS = [
  'Web Design & Development',
  'Mobile App Development',
  'Digital Marketing',
  'UI/UX Design',
  'Branding',
  'HR Tech / Web App',
  'Learning Platform',
  'Cloud / DevOps',
  'Other',
] as const;

export const PORTFOLIO_INDUSTRY_OPTIONS = [
  'IT Services / Consulting',
  'Recruitment & Talent',
  'Education & Early Career',
  'Marketing & Growth',
  'Cloud Infrastructure',
  'Healthcare',
  'Finance / FinTech',
  'E-commerce / Retail',
  'Manufacturing',
  'Real Estate',
  'Media & Entertainment',
  'Non-profit / NGO',
  'Government / Public Sector',
  'Other',
] as const;

export const PORTFOLIO_TIMELINE_OPTIONS = [
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

export function metricsToParagraph(
  metrics: { label: string; value: string }[] | undefined,
): string {
  return (metrics ?? [])
    .map((m) => `${m.label.trim()} | ${m.value.trim()}`)
    .filter((line) => line !== '|')
    .join('\n');
}

export function paragraphToMetrics(
  value: string,
): { label: string; value: string }[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep = line.includes('|') ? '|' : ':';
      const idx = line.indexOf(sep);
      if (idx === -1) {
        return { label: line, value: '' };
      }
      return {
        label: line.slice(0, idx).trim(),
        value: line.slice(idx + 1).trim(),
      };
    })
    .filter((m) => m.label || m.value);
}

/** Slug-style id from title for new portfolio entries. */
export function slugifyPortfolioId(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
