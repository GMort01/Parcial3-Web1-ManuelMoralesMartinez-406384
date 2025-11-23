import { Router } from 'express';
import { getGoals, createGoal, addFunds, deleteGoal } from '../controllers/goalController';

const router = Router();

router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id/add', addFunds); // Ruta especial para sumar dinero
router.delete('/:id', deleteGoal);

export default router;