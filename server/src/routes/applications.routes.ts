import { Router } from 'express';
import * as applicationsController from '../controllers/applications.controller';
import { requireAuth, requireRoles } from '../middleware/auth';
import { uploadResume } from '../middleware/upload';
import { validate } from '../middleware/validate';
import {
  internshipApplicationSchema,
  internshipStatusSchema,
  jobApplicationSchema,
  jobStatusSchema,
  referenceParamSchema,
} from '../validators/applications.validators';

const router = Router();

router.post(
  '/jobs',
  requireAuth,
  uploadResume,
  validate(jobApplicationSchema),
  applicationsController.submitJob,
);

router.post(
  '/internships',
  requireAuth,
  uploadResume,
  validate(internshipApplicationSchema),
  applicationsController.submitInternship,
);

router.get('/mine', requireAuth, applicationsController.getMine);

router.get(
  '/admin',
  requireAuth,
  requireRoles('admin', 'editor'),
  applicationsController.getAdmin,
);

router.patch(
  '/jobs/:referenceNumber/status',
  requireAuth,
  requireRoles('admin', 'editor'),
  validate(referenceParamSchema, 'params'),
  validate(jobStatusSchema),
  applicationsController.patchJobStatus,
);

router.patch(
  '/internships/:referenceNumber/status',
  requireAuth,
  requireRoles('admin', 'editor'),
  validate(referenceParamSchema, 'params'),
  validate(internshipStatusSchema),
  applicationsController.patchInternshipStatus,
);

export default router;
