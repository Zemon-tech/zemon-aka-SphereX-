import { Router } from 'express';
import newsRoutes from './news.routes';
import repoRoutes from './repo.routes';
import storeRoutes from './store.routes';
import eventRoutes from './event.routes';

const router = Router();

// Routes
router.use('/news', newsRoutes);
router.use('/repos', repoRoutes);
router.use('/store', storeRoutes);
router.use('/events', eventRoutes);

export default router; 