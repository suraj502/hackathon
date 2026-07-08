import { Router } from 'express';

import {
  getRound1Results,
  getRound2Results,
  getWinnersResults,
} from '../controllers/resultController.js';

const router = Router();

router.get('/results/round1', getRound1Results);
router.get('/results/round2', getRound2Results);
router.get('/results/winners', getWinnersResults);

export default router;
