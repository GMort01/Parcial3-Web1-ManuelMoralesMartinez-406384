import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- 1. OBTENER TODAS LAS CATEGORÍAS ---
export const getCategories = async (req: Request, res: Response) => {
  try {
    // Buscamos todas en la base de datos
    const categories = await prisma.category.findMany();
    res.json(categories); // Las enviamos como respuesta JSON
  } catch (error) {
    res.status(500).json({ error: "Error al obtener categorías" });
  }
};

// --- 2. CREAR UNA NUEVA CATEGORÍA ---
export const createCategory = async (req: Request, res: Response) => {
  try {
    // Recibimos los datos del cuerpo de la petición (body)
    const { name, color, icon } = req.body;

    // Guardamos en la base de datos
    const newCategory = await prisma.category.create({
      data: {
        name: name,
        color: color,
        icon: icon || "📦" // Si no mandan icono, ponemos una caja por defecto
      }
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error al crear categoría" });
  }
};
// ... (deja el código anterior igual)

// 3. OBTENER UNA SOLA CATEGORÍA (Endpoint #7)
export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({
    where: { id: parseInt(id) }
  });
  if (!category) return res.status(404).json({ error: "Categoría no encontrada" });
  res.json(category);
};

// 4. ACTUALIZAR CATEGORÍA (Endpoint #8)
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, color, icon } = req.body;
  try {
    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, color, icon }
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "No se pudo actualizar" });
  }
};

// 5. ELIMINAR CATEGORÍA (Endpoint #9)
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(400).json({ error: "No se pudo eliminar (quizás tiene transacciones asociadas)" });
  }
};