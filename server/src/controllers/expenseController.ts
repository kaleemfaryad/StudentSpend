import {Request, Response} from 'express';
import prisma from '../config/prisma';

// CREATE EXPENSE
export const createExpense = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId =
      (req as any).userId;

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated.',
      });
    }

    const {
      amount,
      description,
      category,
      date,
    } = req.body;

    if (
      amount === undefined ||
      !description ||
      !category ||
      !date
    ) {
      return res.status(400).json({
        message:
          'Amount, description, category and date are required.',
      });
    }

    const numericAmount =
      Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        message:
          'Amount must be greater than 0.',
      });
    }

    const expense =
      await prisma.expense.create({
        data: {
          amount: numericAmount,
          description,
          category,
          date: new Date(date),

          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

    return res.status(201).json({
      message: 'Expense created successfully.',
      expense,
    });
  } catch (error) {
    console.error(
      'Create expense error:',
      error,
    );

    return res.status(500).json({
      message: 'Failed to create expense.',
    });
  }
};
// GET ALL EXPENSES
export const getExpenses = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any).userId;

    const expenses =
      await prisma.expense.findMany({
        where: {
          userId,
        },
        orderBy: {
          date: 'desc',
        },
      });

    return res.json({
      expenses,
    });
  } catch (error) {
    console.error(
      'Get expenses error:',
      error,
    );

    return res.status(500).json({
      message: 'Failed to fetch expenses.',
    });
  }
};

// GET SINGLE EXPENSE
export const getExpense = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any).userId;
    const id = String(req.params.id);

    const expense =
      await prisma.expense.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!expense) {
      return res.status(404).json({
        message: 'Expense not found.',
      });
    }

    return res.json({
      expense,
    });
  } catch (error) {
    console.error(
      'Get expense error:',
      error,
    );

    return res.status(500).json({
      message: 'Failed to fetch expense.',
    });
  }
};

// UPDATE EXPENSE
export const updateExpense = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any).userId;
    const id = String(req.params.id);

    const {
      amount,
      description,
      category,
      date,
    } = req.body;

    const existingExpense =
      await prisma.expense.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!existingExpense) {
      return res.status(404).json({
        message: 'Expense not found.',
      });
    }

    const numericAmount =
      amount !== undefined
        ? Number(amount)
        : existingExpense.amount;

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        message:
          'Amount must be greater than 0.',
      });
    }

    const expense =
      await prisma.expense.update({
        where: {
          id,
        },
        data: {
          amount: numericAmount,
          description:
            description ??
            existingExpense.description,
          category:
            category ??
            existingExpense.category,
          date: date
            ? new Date(date)
            : existingExpense.date,
        },
      });

    return res.json({
      message: 'Expense updated successfully.',
      expense,
    });
  } catch (error) {
    console.error(
      'Update expense error:',
      error,
    );

    return res.status(500).json({
      message: 'Failed to update expense.',
    });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = (req as any).userId;
    const id = String(req.params.id);

    const existingExpense =
      await prisma.expense.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!existingExpense) {
      return res.status(404).json({
        message: 'Expense not found.',
      });
    }

    await prisma.expense.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: 'Expense deleted successfully.',
    });
  } catch (error) {
    console.error(
      'Delete expense error:',
      error,
    );

    return res.status(500).json({
      message: 'Failed to delete expense.',
    });
  }
};