import { Router } from 'express';
import newsRoutes from './news.routes';
import repoRoutes from './repo.routes';

const router = Router();

// Routes
router.use('/news', newsRoutes);
router.use('/repos', repoRoutes);

export default router; 