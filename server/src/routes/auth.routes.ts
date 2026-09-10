import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import {
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from '../validators/auth.validators';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail,
);
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  authController.resendVerification,
);

export default router;
