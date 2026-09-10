export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/** Simulate a network submit without hanging forever. */
export async function simulateSubmit(ms = 900): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return `QDL-${Date.now().toString(36).toUpperCase()}`;
}

export const RESUME_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function isAllowedResume(file: File): boolean {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const name = file.name.toLowerCase();
  const hasExt = allowedExtensions.some((ext) => name.endsWith(ext));
  const allowedMime = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '',
  ];
  return hasExt && allowedMime.includes(file.type) && file.size <= MAX_RESUME_BYTES;
}
