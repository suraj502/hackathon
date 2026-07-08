import { Router } from 'express';

import { loginAdmin } from '../controllers/authController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protectAdmin } from '../middleware/auth.js';
import { validateAdminLogin } from '../middleware/validate.js';

const router = Router();

router.post('/login', validateAdminLogin, loginAdmin);
router.get('/dashboard', protectAdmin, getDashboardStats);

export default router;
