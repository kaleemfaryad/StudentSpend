export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Education'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
}

export interface Budget {
  amount: number;
  month: string;
}