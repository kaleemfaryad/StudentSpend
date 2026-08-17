import {
  apiRequest,
} from './api';


// ========================================
// BUDGET TYPE
// ========================================

export interface Budget {
  id: string;

  amount: number;

  month: number;

  year: number;

  userId: string;

  createdAt?: string;

  updatedAt?: string;
}


// ========================================
// GET BUDGET RESPONSE
// ========================================

interface GetBudgetResponse {
  budget: Budget | null;
}


// ========================================
// SAVE BUDGET RESPONSE
// ========================================

interface SaveBudgetResponse {
  budget: Budget;
}


// ========================================
// GET MONTHLY BUDGET
// ========================================

export const getBudgetApi = async (
  token: string,
): Promise<Budget | null> => {

  const response =
    await apiRequest<GetBudgetResponse>(
      '/budget',
      {
        method: 'GET',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      },
    );

  return response.budget ?? null;
};


// ========================================
// SAVE MONTHLY BUDGET
// ========================================

export const saveBudgetApi = async (
  token: string,
  amount: number,
): Promise<Budget> => {

  const response =
    await apiRequest<SaveBudgetResponse>(
      '/budget',
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          amount,
        }),
      },
    );

  return response.budget;
};