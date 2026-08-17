import {Router} from 'express';

import {
  getBudget,
  saveBudget,
} from '../controllers/budgetController';

import authenticate from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  getBudget,
);

router.post(
  '/',
  saveBudget,
);

export default router;