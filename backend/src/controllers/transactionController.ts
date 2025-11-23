import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. OBTENER TODAS LAS TRANSACCIONES
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true }, // ¡Truco! Trae los datos de la categoría asociada
      orderBy: { date: 'desc' }    // Las más nuevas primero
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
};

// 2. CREAR TRANSACCIÓN (Ingreso o Gasto)
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { amount, description, type, categoryId } = req.body;

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        type,       // 'INCOME' o 'EXPENSE'
        categoryId: parseInt(categoryId) // Vinculamos con la categoría
      }
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: "Error al crear transacción" });
  }
};

// 3. ELIMINAR TRANSACCIÓN
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.transaction.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Transacción eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};