import { Router } from 'express';
import AlimentoController from '../controllers/alimentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';

const router = Router();

router.get('/', authMiddleware, AlimentoController.index);
router.post('/', authMiddleware, authorizeRole(['NUTRICIONISTA', 'DIRECAO']), AlimentoController.store);
router.delete('/:id', authMiddleware, authorizeRole(['NUTRICIONISTA', 'DIRECAO']), AlimentoController.destroy);

export default router;
