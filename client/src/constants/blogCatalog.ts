import { BLOG_CATEGORIES } from '../data/blog';

export const BLOG_CATEGORY_OPTIONS = [...BLOG_CATEGORIES, 'Other'] as const;

export const BLOG_READING_TIME_OPTIONS = [
  '3 min',
  '4 min',
  '5 min',
  '6 min',
  '7 min',
  '8 min',
  '10 min',
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

export function slugifyBlogSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
