import { Router } from 'express';
import * as uploadsController from '../controllers/uploads.controller';
import { requireAuth, requireRoles } from '../middleware/auth';
import {
  uploadCoverImage,
  uploadPortfolioGallery,
  uploadProjectScreenshots,
} from '../middleware/upload';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.post(
  '/project-screenshots',
  ...admin,
  uploadProjectScreenshots,
  uploadsController.uploadProjectScreenshots,
);

router.post(
  '/portfolio-gallery',
  ...admin,
  uploadPortfolioGallery,
  uploadsController.uploadPortfolioGallery,
);

router.post(
  '/cover',
  ...admin,
  uploadCoverImage,
  uploadsController.uploadCoverImage,
);

export default router;
