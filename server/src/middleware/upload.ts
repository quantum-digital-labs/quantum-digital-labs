import fs from 'fs';
import os from 'os';
import path from 'path';
import multer from 'multer';
import { AppError } from '../utils/AppError';

const uploadRoot = path.join(os.tmpdir(), 'quantum-uploads');
const resumesDir = path.join(uploadRoot, 'resumes');
const projectsDir = path.join(uploadRoot, 'projects');
const portfolioDir = path.join(uploadRoot, 'portfolio');
const coversDir = path.join(uploadRoot, 'covers');
const defaultsDir = path.join(uploadRoot, 'defaults');
const assetsDefaultsDir = path.resolve(process.cwd(), 'assets', 'defaults');

for (const dir of [
  resumesDir,
  projectsDir,
  portfolioDir,
  coversDir,
  defaultsDir,
]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureDefaultFile(fileName: string) {
  const runtimePath = path.join(defaultsDir, fileName);
  const bundledPath = path.join(assetsDefaultsDir, fileName);
  if (!fs.existsSync(runtimePath) && fs.existsSync(bundledPath)) {
    fs.copyFileSync(bundledPath, runtimePath);
  }
}

ensureDefaultFile('project-screenshot.jpg');
ensureDefaultFile('portfolio-gallery-1.jpg');
ensureDefaultFile('portfolio-gallery-2.jpg');
ensureDefaultFile('portfolio-gallery-3.jpg');
ensureDefaultFile('project-cover.jpg');
ensureDefaultFile('portfolio-cover.jpg');
ensureDefaultFile('service-cover.jpg');

function makeImageStorage(destination: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${safe}`);
    },
  });
}

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resumesDir);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const RESUME_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const IMAGE_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function imageFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (!IMAGE_MIME.has(file.mimetype)) {
    cb(new AppError('Images must be JPG, PNG, WEBP, or GIF', 400));
    return;
  }
  cb(null, true);
}

export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!RESUME_MIME.has(file.mimetype)) {
      cb(new AppError('Resume must be a PDF or Word document', 400));
      return;
    }
    cb(null, true);
  },
}).single('resume');

export const uploadProjectScreenshots = multer({
  storage: makeImageStorage(projectsDir),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: imageFileFilter,
}).array('screenshots', 12);

export const uploadPortfolioGallery = multer({
  storage: makeImageStorage(portfolioDir),
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: imageFileFilter,
}).array('gallery', 12);

export const uploadCoverImage = multer({
  storage: makeImageStorage(coversDir),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: imageFileFilter,
}).single('image');

/** Public path used when a project has no uploaded screenshots. */
export const DEFAULT_PROJECT_SCREENSHOT =
  '/uploads/defaults/project-screenshot.jpg';

/** Default gallery images when a portfolio item has none uploaded. */
export const DEFAULT_PORTFOLIO_GALLERY = [
  '/uploads/defaults/portfolio-gallery-1.jpg',
  '/uploads/defaults/portfolio-gallery-2.jpg',
  '/uploads/defaults/portfolio-gallery-3.jpg',
] as const;

export const DEFAULT_PROJECT_COVER = '/uploads/defaults/project-cover.jpg';
export const DEFAULT_PORTFOLIO_COVER = '/uploads/defaults/portfolio-cover.jpg';
export const DEFAULT_SERVICE_COVER = '/uploads/defaults/service-cover.jpg';

export function isStoredImageUrl(value: string): boolean {
  const trimmed = value.trim();
  return (
    trimmed.startsWith('/uploads/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/')
  );
}

export function resolveCoverImage(
  value: unknown,
  fallback: string,
): string {
  const trimmed = String(value ?? '').trim();
  return isStoredImageUrl(trimmed) ? trimmed : fallback;
}
