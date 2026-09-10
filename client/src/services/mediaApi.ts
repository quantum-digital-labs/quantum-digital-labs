import { apiClient } from './apiClient';

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5050/api';

/** Origin that serves `/uploads/...` (API host without `/api`). */
export function getUploadsOrigin(): string {
  try {
    const url = new URL(apiBase);
    return url.origin;
  } catch {
    return 'http://localhost:5050';
  }
}

export const DEFAULT_PROJECT_SCREENSHOT =
  '/uploads/defaults/project-screenshot.jpg';

export const DEFAULT_PORTFOLIO_GALLERY = [
  '/uploads/defaults/portfolio-gallery-1.jpg',
  '/uploads/defaults/portfolio-gallery-2.jpg',
  '/uploads/defaults/portfolio-gallery-3.jpg',
] as const;

export const DEFAULT_PROJECT_COVER = '/uploads/defaults/project-cover.jpg';
export const DEFAULT_PORTFOLIO_COVER = '/uploads/defaults/portfolio-cover.jpg';
export const DEFAULT_SERVICE_COVER = '/uploads/defaults/service-cover.jpg';

export function resolveMediaUrl(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) {
    return `${getUploadsOrigin()}${DEFAULT_PROJECT_COVER}`;
  }
  if (
    pathOrUrl.startsWith('http://') ||
    pathOrUrl.startsWith('https://') ||
    pathOrUrl.startsWith('data:') ||
    pathOrUrl.startsWith('blob:')
  ) {
    return pathOrUrl;
  }
  if (pathOrUrl.startsWith('/')) {
    return `${getUploadsOrigin()}${pathOrUrl}`;
  }
  return pathOrUrl;
}

export function isUploadedImageUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  );
}

export function isCustomCoverImage(value: string | undefined | null): boolean {
  if (!value || !isUploadedImageUrl(value)) return false;
  return !value.includes('/uploads/defaults/');
}

export async function uploadProjectScreenshots(
  files: File[],
): Promise<string[]> {
  if (!files.length) return [];
  const form = new FormData();
  for (const file of files) {
    form.append('screenshots', file);
  }
  const { data } = await apiClient.post<{ urls: string[] }>(
    '/uploads/project-screenshots',
    form,
  );
  return data.urls ?? [];
}

export async function uploadPortfolioGallery(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const form = new FormData();
  for (const file of files) {
    form.append('gallery', file);
  }
  const { data } = await apiClient.post<{ urls: string[] }>(
    '/uploads/portfolio-gallery',
    form,
  );
  return data.urls ?? [];
}

export async function uploadCoverImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('image', file);
  const { data } = await apiClient.post<{ url: string }>('/uploads/cover', form);
  return data.url;
}
