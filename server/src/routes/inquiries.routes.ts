import { Router } from 'express';
import * as inquiriesController from '../controllers/inquiries.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  contactInquirySchema,
  demoInquirySchema,
  quoteInquirySchema,
} from '../validators/inquiries.validators';

const router = Router();

router.post(
  '/contact',
  validate(contactInquirySchema),
  inquiriesController.submitContact,
);

router.post(
  '/quote',
  requireAuth,
  validate(quoteInquirySchema),
  inquiriesController.submitQuote,
);

router.post(
  '/demo',
  validate(demoInquirySchema),
  inquiriesController.submitDemo,
);

export default router;
