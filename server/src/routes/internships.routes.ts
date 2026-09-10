import { Router } from 'express';
import * as internshipsController from '../controllers/internships.controller';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.get('/', internshipsController.listInternships);
router.get('/:id', internshipsController.getInternship);
router.post('/', ...admin, internshipsController.createInternship);
router.patch('/:id', ...admin, internshipsController.updateInternship);
router.delete('/:id', ...admin, internshipsController.deleteInternship);

export default router;
