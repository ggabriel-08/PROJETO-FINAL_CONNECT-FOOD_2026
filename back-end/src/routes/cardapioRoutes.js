import { Router } from 'express';
import CardapioController from '../controllers/cardapioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = Router();

router.get('/', authMiddleware, CardapioController.index);
router.post('/refeicoes/alimentos', authMiddleware, authorizeRole(['NUTRICIONISTA', 'DIRECAO']), CardapioController.updateMealFoods);

export default router;
