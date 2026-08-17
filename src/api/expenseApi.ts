import {
  apiRequest,
} from './api';

import {
  Expense,
} from '../types/expense';


// ========================================
// GET EXPENSES RESPONSE
// ========================================

interface GetExpensesResponse {
  expenses: Expense[];
}


// ========================================
// GET ALL EXPENSES
// ========================================

export const getExpensesApi =
  async (
    token: string,
  ): Promise<Expense[]> => {

    const response =
      await apiRequest<GetExpensesResponse>(
        '/expenses',
        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

    return response.expenses;
  };


// ========================================
// CREATE EXPENSE
// ========================================

export const createExpenseApi =
  async (
    token: string,

    expense: {
      amount: number;
      description: string;
      category: Expense['category'];
      date: string;
    },
  ): Promise<Expense> => {

    return apiRequest<Expense>(
      '/expenses',
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(
          expense,
        ),
      },
    );
  };


// ========================================
// DELETE EXPENSE
// ========================================

export const deleteExpenseApi =
  async (
    token: string,
    id: string,
  ): Promise<{
    message: string;
  }> => {

    return apiRequest<{
      message: string;
    }>(
      `/expenses/${id}`,
      {
        method: 'DELETE',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );
  };


// ========================================
// UPDATE EXPENSE
// ========================================

export const updateExpenseApi =
  async (
    token: string,

    id: string,

    expense: {
      amount: number;
      description: string;
      category: Expense['category'];
      date: string;
    },
  ): Promise<Expense> => {

    return apiRequest<Expense>(
      `/expenses/${id}`,
      {
        method: 'PUT',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(
          expense,
        ),
      },
    );
  };