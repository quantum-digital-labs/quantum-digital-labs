import { Router } from 'express';
import * as jobsController from '../controllers/jobs.controller';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.get('/', jobsController.listJobs);
router.get('/:id', jobsController.getJob);
router.post('/', ...admin, jobsController.createJob);
router.patch('/:id', ...admin, jobsController.updateJob);
router.delete('/:id', ...admin, jobsController.deleteJob);

export default router;
