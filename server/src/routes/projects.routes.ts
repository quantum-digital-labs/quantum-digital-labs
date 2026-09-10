import { Router } from 'express';
import * as projectsController from '../controllers/projects.controller';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.get('/', projectsController.listProjects);
router.get('/:id', projectsController.getProject);
router.post('/', ...admin, projectsController.createProject);
router.patch('/:id', ...admin, projectsController.updateProject);
router.delete('/:id', ...admin, projectsController.deleteProject);

export default router;
