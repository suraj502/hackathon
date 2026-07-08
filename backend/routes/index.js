import { Router } from 'express';

import adminRoutes from './adminRoutes.js';
import teamRoutes from './teamRoutes.js';
import resultRoutes from './resultRoutes.js';

const router = Router();

router.use('/admin', adminRoutes);
router.use('/', teamRoutes);
router.use('/', resultRoutes);

export default router;
