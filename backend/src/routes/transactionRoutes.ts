import { Router } from 'express';
import { getTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';

const router = Router();

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Obtener historial de transacciones
 *     tags: [Transacciones]
 *     responses:
 *       200:
 *         description: Lista de transacciones con su categoría
 *   post:
 *     summary: Registrar un nuevo movimiento (Ingreso/Gasto)
 *     tags: [Transacciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: EXPENSE
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transacción creada
 *
 * /transactions/{id}:
 *   delete:
 *     summary: Eliminar una transacción por ID
 *     tags: [Transacciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 */
router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;