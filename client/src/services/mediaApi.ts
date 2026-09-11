import { supabase } from '../lib/supabaseClient';

export const DEFAULT_PROJECT_SCREENSHOT = '/defaults/project-screenshot.jpg';

export const DEFAULT_PORTFOLIO_GALLERY = [
  '/defaults/portfolio-gallery-1.jpg',
  '/defaults/portfolio-gallery-2.jpg',
  '/defaults/portfolio-gallery-3.jpg',
] as const;

export const DEFAULT_PROJECT_COVER = '/defaults/project-cover.jpg';
export const DEFAULT_PORTFOLIO_COVER = '/defaults/portfolio-cover.jpg';
export const DEFAULT_SERVICE_COVER = '/defaults/service-cover.jpg';

/** Uploads now go straight to Supabase Storage — there is no separate API
 * origin to resolve relative `/uploads/...` paths against any more. */
export function getUploadsOrigin(): string {
  return '';
}

export function resolveMediaUrl(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) return DEFAULT_PROJECT_COVER;
  if (
    pathOrUrl.startsWith('http://') ||
    pathOrUrl.startsWith('https://') ||
    pathOrUrl.startsWith('data:') ||
    pathOrUrl.startsWith('blob:') ||
    pathOrUrl.startsWith('/')
  ) {
    return pathOrUrl;
  }
  return pathOrUrl;
}

export function isUploadedImageUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('/defaults/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:')
  );
}

export function isCustomCoverImage(value: string | undefined | null): boolean {
  if (!value || !isUploadedImageUrl(value)) return false;
  return !value.includes('/defaults/') && !value.includes('/uploads/defaults/');
}

const IMAGE_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);

function assertImage(file: File) {
  if (!IMAGE_MIME.has(file.type)) {
    throw new Error('Images must be JPG, PNG, WEBP, or GIF');
  }
}

async function uploadToMedia(folder: string, file: File): Promise<string> {
  assertImage(file);
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from('media').upload(path, file, {
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProjectScreenshots(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadToMedia('projects', file));
  }
  return urls;
}

export async function uploadPortfolioGallery(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadToMedia('portfolio', file));
  }
  return urls;
}

export async function uploadCoverImage(file: File): Promise<string> {
  return uploadToMedia('covers', file);
}
