import { Router } from 'express';
import newsRoutes from './news.routes';
import repoRoutes from './repo.routes';
import storeRoutes from './store.routes';

const router = Router();

// Routes
router.use('/news', newsRoutes);
router.use('/repos', repoRoutes);
router.use('/store', storeRoutes);

export default router; 