import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getGoals = async (req: Request, res: Response) => {
  const goals = await prisma.goal.findMany();
  res.json(goals);
};

export const createGoal = async (req: Request, res: Response) => {
  const { name, targetAmount, icon } = req.body;
  const goal = await prisma.goal.create({
    data: { name, targetAmount: parseFloat(targetAmount), icon, currentAmount: 0 }
  });
  res.json(goal);
};

export const addFunds = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount } = req.body; // Cantidad a sumar
  
  // 1. Buscamos la meta actual
  const goal = await prisma.goal.findUnique({ where: { id: parseInt(id) }});
  if (!goal) return res.status(404).json({error: "Meta no encontrada"});

  // 2. Sumamos
  const updated = await prisma.goal.update({
    where: { id: parseInt(id) },
    data: { currentAmount: goal.currentAmount + parseFloat(amount) }
  });
  res.json(updated);
};

export const deleteGoal = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.goal.delete({ where: { id: parseInt(id) } });
  res.json({ message: "Meta eliminada" });
};