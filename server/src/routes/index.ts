import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import authRoutes from './auth.routes';
import applicationsRoutes from './applications.routes';
import inquiriesRoutes from './inquiries.routes';
import healthRoutes from './health.routes';
import jobsRoutes from './jobs.routes';
import internshipsRoutes from './internships.routes';
import projectsRoutes from './projects.routes';
import portfolioRoutes from './portfolio.routes';
import blogRoutes from './blog.routes';
import servicesRoutes from './services.routes';
import aboutRoutes from './about.routes';
import uploadsRoutes from './uploads.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/applications', applicationsRoutes);
router.use('/inquiries', inquiriesRoutes);
router.use('/uploads', uploadsRoutes);

const contentRouter = Router();
contentRouter.use(optionalAuth);
contentRouter.use('/jobs', jobsRoutes);
contentRouter.use('/internships', internshipsRoutes);
contentRouter.use('/projects', projectsRoutes);
contentRouter.use('/portfolio', portfolioRoutes);
contentRouter.use('/blog', blogRoutes);
contentRouter.use('/services', servicesRoutes);
contentRouter.use('/about', aboutRoutes);
router.use('/content', contentRouter);

export default router;
