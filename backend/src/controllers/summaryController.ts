import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSummary = async (req: Request, res: Response) => {
  try {
    // Sumar todos los ingresos
    const income = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: 'INCOME' }
    });

    // Sumar todos los gastos
    const expense = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: 'EXPENSE' }
    });

    // Calcular el balance total
    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance
    });
  } catch (error) {
    res.status(500).json({ error: "Error al calcular el resumen" });
  }
};