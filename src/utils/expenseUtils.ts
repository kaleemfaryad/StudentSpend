import {Expense, ExpenseCategory} from '../types/expense';

export const calculateTotal = (
  expenses: Expense[],
): number => {
  return expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
};

export const calculateCategoryTotal = (
  expenses: Expense[],
  category: ExpenseCategory,
): number => {
  return expenses
    .filter(expense => expense.category === category)
    .reduce(
      (total, expense) => total + expense.amount,
      0,
    );
};

export const formatCurrency = (
  amount: number,
): string => {
  return `Rs. ${amount.toLocaleString()}`;
};

export const getCurrentMonth = (): string => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}`;
};

export const getMonthlyExpenses = (
  expenses: Expense[],
): Expense[] => {
  const currentMonth = getCurrentMonth();

  return expenses.filter(expense =>
    expense.date.startsWith(currentMonth),
  );
};