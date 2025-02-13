import { Router } from 'express';

// Import route modules
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import eventRoutes from './event.routes';
import newsRoutes from './news.routes';
import repoRoutes from './repo.routes';

const router = Router();

// Define routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/events', eventRoutes);
router.use('/news', newsRoutes);
router.use('/repos', repoRoutes);

export default router; 