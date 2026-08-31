import { Router } from 'express';
import ComentarioController from '../controllers/comentarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, ComentarioController.index);
router.post('/', authMiddleware, ComentarioController.store);
router.patch('/:id/remover', authMiddleware, ComentarioController.remove);

export default router;
