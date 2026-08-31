import { Router } from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, UsuarioController.index);
router.post('/aluno', authMiddleware, UsuarioController.createStudent);
router.post('/nutricionista', authMiddleware, UsuarioController.createNutritionist);
router.patch('/:id/status', authMiddleware, UsuarioController.toggleStatus);

export default router;