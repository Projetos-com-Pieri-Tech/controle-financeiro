import { Router } from 'express';
import { CategoryController } from '../adapters/controllers/CategoryController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../application/services/AuthService';

export function createCategoryRoutes(
  categoryController: CategoryController,
  authService: AuthService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.use(authMiddleware); // Todas as rotas de categoria precisam de autenticação

  router.post('/', (req, res) => categoryController.create(req, res));
  router.get('/', (req, res) => categoryController.list(req, res));
  router.put('/:id', (req, res) => categoryController.update(req, res));
  router.delete('/:id', (req, res) => categoryController.delete(req, res));

  return router;
}