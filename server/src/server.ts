import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import budgetRoutes from './routes/budgetRoutes';

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// PORT
// ========================================

const PORT = Number(
  process.env.PORT || 5000,
);

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'StudentSpend backend is healthy',
  });
});

// ========================================
// API ROUTES
// ========================================

app.use(
  '/api/auth',
  authRoutes,
);

app.use(
  '/api/expenses',
  expenseRoutes,
);

app.use(
  '/api/budget',
  budgetRoutes,
);

// ========================================
// START SERVER
// ========================================

app.listen(
  PORT,
  '0.0.0.0',
  () => {
    console.log(
      `StudentSpend API running on port ${PORT}`,
    );
  },
);