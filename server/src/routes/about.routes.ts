import { Router } from 'express';
import * as aboutController from '../controllers/about.controller';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.get('/', aboutController.getAbout);
router.put('/', ...admin, aboutController.putAbout);

export default router;
