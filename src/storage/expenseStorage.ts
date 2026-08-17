import AsyncStorage from '@react-native-async-storage/async-storage';

import {Expense} from '../types/expense';


// ========================================
// Storage Keys
// ========================================

const EXPENSES_KEY =
  '@studentspend_expenses';

const BUDGET_KEY =
  '@studentspend_monthly_budget';


// ========================================
// EXPENSE FUNCTIONS
// ========================================


// Get all expenses

export const getExpenses =
  async (): Promise<Expense[]> => {

    try {

      const storedExpenses =
        await AsyncStorage.getItem(
          EXPENSES_KEY,
        );

      if (!storedExpenses) {
        return [];
      }

      return JSON.parse(
        storedExpenses,
      );

    } catch (error) {

      console.log(
        'Error loading expenses:',
        error,
      );

      return [];
    }
  };


// Save a new expense

export const saveExpense = async (
  expense: Expense,
): Promise<void> => {

  try {

    const existingExpenses =
      await getExpenses();

    const updatedExpenses = [
      expense,
      ...existingExpenses,
    ];

    await AsyncStorage.setItem(
      EXPENSES_KEY,
      JSON.stringify(
        updatedExpenses,
      ),
    );

    console.log(
      'All Expenses:',
      updatedExpenses,
    );

  } catch (error) {

    console.log(
      'Error saving expense:',
      error,
    );

    throw error;
  }
};


// Delete expense

export const deleteExpense = async (
  expenseId: string,
): Promise<void> => {

  try {

    const existingExpenses =
      await getExpenses();

    const updatedExpenses =
      existingExpenses.filter(
        expense =>
          expense.id !== expenseId,
      );

    await AsyncStorage.setItem(
      EXPENSES_KEY,
      JSON.stringify(
        updatedExpenses,
      ),
    );

  } catch (error) {

    console.log(
      'Error deleting expense:',
      error,
    );

    throw error;
  }
};


// Update expense

export const updateExpense = async (
  updatedExpense: Expense,
): Promise<void> => {

  try {

    const existingExpenses =
      await getExpenses();

    const updatedExpenses =
      existingExpenses.map(
        expense =>
          expense.id ===
          updatedExpense.id
            ? updatedExpense
            : expense,
      );

    await AsyncStorage.setItem(
      EXPENSES_KEY,
      JSON.stringify(
        updatedExpenses,
      ),
    );

    console.log(
      'Expense updated:',
      updatedExpense,
    );

  } catch (error) {

    console.log(
      'Error updating expense:',
      error,
    );

    throw error;
  }
};


// Clear all expenses

export const clearExpenses =
  async (): Promise<void> => {

    try {

      await AsyncStorage.removeItem(
        EXPENSES_KEY,
      );

    } catch (error) {

      console.log(
        'Error clearing expenses:',
        error,
      );

      throw error;
    }
  };


// ========================================
// BUDGET FUNCTIONS
// ========================================


// Get monthly budget

export const getBudget =
  async (): Promise<number | null> => {

    try {

      const storedBudget =
        await AsyncStorage.getItem(
          BUDGET_KEY,
        );

      if (!storedBudget) {
        return null;
      }

      return Number(
        storedBudget,
      );

    } catch (error) {

      console.log(
        'Error loading budget:',
        error,
      );

      return null;
    }
  };


// Save monthly budget

export const saveBudget = async (
  amount: number,
): Promise<void> => {

  try {

    await AsyncStorage.setItem(
      BUDGET_KEY,
      String(amount),
    );

    console.log(
      'Monthly budget saved:',
      amount,
    );

  } catch (error) {

    console.log(
      'Error saving budget:',
      error,
    );

    throw error;
  }
};


// Clear monthly budget

export const clearBudget =
  async (): Promise<void> => {

    try {

      await AsyncStorage.removeItem(
        BUDGET_KEY,
      );

    } catch (error) {

      console.log(
        'Error clearing budget:',
        error,
      );

      throw error;
    }
  };