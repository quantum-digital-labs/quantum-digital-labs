import { Router } from 'express';
import * as servicesController from '../controllers/services.controller';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.get('/', servicesController.listServices);
router.post('/categories', ...admin, servicesController.createServiceCategory);
router.patch(
  '/categories/:categoryId',
  ...admin,
  servicesController.updateServiceCategory,
);
router.delete(
  '/categories/:categoryId',
  ...admin,
  servicesController.deleteServiceCategory,
);
router.get('/:categoryId', servicesController.getServiceCategory);
router.get('/:categoryId/:slug', servicesController.getService);
router.post('/:categoryId', ...admin, servicesController.createService);
router.patch('/:categoryId/:slug', ...admin, servicesController.updateService);
router.delete('/:categoryId/:slug', ...admin, servicesController.deleteService);

export default router;
