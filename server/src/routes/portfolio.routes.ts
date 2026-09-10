import { Router } from 'express';
import * as portfolioController from '../controllers/portfolio.controller';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.get('/', portfolioController.listPortfolio);
router.get('/:id', portfolioController.getPortfolioItem);
router.post('/', ...admin, portfolioController.createPortfolioItem);
router.patch('/:id', ...admin, portfolioController.updatePortfolioItem);
router.delete('/:id', ...admin, portfolioController.deletePortfolioItem);

export default router;
