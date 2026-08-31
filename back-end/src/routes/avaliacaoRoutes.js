import { Router } from 'express';
import AvaliacaoController from '../controllers/avaliacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, AvaliacaoController.index);
router.post('/', authMiddleware, AvaliacaoController.store);

export default router;
