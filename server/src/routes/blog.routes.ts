import { Router } from 'express';
import * as blogController from '../controllers/blog.controller';
import { requireAuth, requireRoles } from '../middleware/auth';

const router = Router();
const admin = [requireAuth, requireRoles('admin', 'editor')] as const;

router.get('/', blogController.listBlog);
router.get('/:slug', blogController.getBlogPost);
router.post('/', ...admin, blogController.createBlogPost);
router.patch('/:slug', ...admin, blogController.updateBlogPost);
router.delete('/:slug', ...admin, blogController.deleteBlogPost);

export default router;
