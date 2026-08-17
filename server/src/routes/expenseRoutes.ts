import {Router} from 'express';

import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController';

import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/',
  createExpense,
);

router.get(
  '/',
  getExpenses,
);

router.get(
  '/:id',
  getExpense,
);

router.put(
  '/:id',
  updateExpense,
);

router.delete(
  '/:id',
  deleteExpense,
);

export default router;