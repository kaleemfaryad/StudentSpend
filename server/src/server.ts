import express from 'express';

import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import budgetRoutes from './routes/budgetRoutes';

const app = express();

app.use(express.json());

const PORT = 5000;

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'StudentSpend backend is healthy',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);

app.listen(PORT, () => {
  console.log(
    `StudentSpend API running on port ${PORT}`,
  );
});