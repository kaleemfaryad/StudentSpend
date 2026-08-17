import {Request, Response} from 'express';

import prisma from '../config/prisma';


// ========================================
// GET CURRENT MONTH'S BUDGET
// ========================================

export const getBudget = async (
  req: Request,
  res: Response,
) => {

  try {

    const userId =
      (req as any).userId;

    if (!userId) {

      return res.status(401).json({
        message:
          'User ID not found.',
      });

    }

    const now =
      new Date();

    const month =
      now.getMonth() + 1;

    const year =
      now.getFullYear();


    const budget =
      await prisma.budget.findUnique({

        where: {

          userId_month_year: {

            userId,

            month,

            year,

          },

        },

      });


    return res.json({

      budget:
        budget ?? null,

    });

  } catch (error) {

    console.error(
      'Get budget error:',
      error,
    );

    return res.status(500).json({

      message:
        'Failed to get budget',

    });

  }

};


// ========================================
// CREATE / UPDATE MONTHLY BUDGET
// ========================================

export const saveBudget = async (
  req: Request,
  res: Response,
) => {

  try {

    const userId =
      (req as any).userId;

    if (!userId) {

      return res.status(401).json({
        message:
          'User ID not found.',
      });

    }


    const {
      amount,
    } = req.body;


    const numericAmount =
      Number(amount);


    if (
      Number.isNaN(
        numericAmount,
      ) ||
      numericAmount <= 0
    ) {

      return res.status(400).json({

        message:
          'Budget must be greater than 0',

      });

    }


    const now =
      new Date();

    const month =
      now.getMonth() + 1;

    const year =
      now.getFullYear();


    const budget =
      await prisma.budget.upsert({

        where: {

          userId_month_year: {

            userId,

            month,

            year,

          },

        },

        update: {

          amount:
            numericAmount,

        },

        create: {

          amount:
            numericAmount,

          month,

          year,

          userId,

        },

      });


    return res.json({

      budget,

    });

  } catch (error) {

    console.error(
      'Save budget error:',
      error,
    );

    return res.status(500).json({

      message:
        'Failed to save budget',

    });

  }

};