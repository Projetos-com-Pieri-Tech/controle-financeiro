import { Router } from 'express';
import { AccountController } from '../adapters/controllers/AccountController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../application/services/AuthService';

export function createAccountRoutes(
  accountController: AccountController,
  authService: AuthService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.use(authMiddleware); // Todas as rotas de conta precisam de autenticação

  router.post('/', (req, res) => accountController.create(req, res));
  router.get('/', (req, res) => accountController.list(req, res));
  router.get('/:id', (req, res) => accountController.getWithBalance(req, res));
  router.put('/:id', (req, res) => accountController.update(req, res));
  router.delete('/:id', (req, res) => accountController.delete(req, res));

  return router;
}