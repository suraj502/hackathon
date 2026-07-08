import { Router } from 'express';

import {
  deleteTeam,
  getTeamById,
  getTeams,
  registerTeam,
  updateTeamStatus,
} from '../controllers/teamController.js';
import { protectAdmin } from '../middleware/auth.js';
import { registerLimiter } from '../middleware/rateLimit.js';
import { validateRegisterTeam, validateStatusUpdate } from '../middleware/validate.js';

const router = Router();

router.post('/register', registerLimiter, validateRegisterTeam, registerTeam);
router.get('/teams', protectAdmin, getTeams);
router.get('/team/:id', protectAdmin, getTeamById);
router.patch('/team/:id/status', protectAdmin, validateStatusUpdate, updateTeamStatus);
router.delete('/team/:id', protectAdmin, deleteTeam);

export default router;
