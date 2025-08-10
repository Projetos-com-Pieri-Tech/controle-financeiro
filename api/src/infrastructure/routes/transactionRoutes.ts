import { Router } from 'express';
import { TransactionController } from '../adapters/controllers/TransactionController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../application/services/AuthService';

export function createTransactionRoutes(
  transactionController: TransactionController,
  authService: AuthService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.use(authMiddleware); // Todas as rotas de transação precisam de autenticação

  router.post('/', (req, res) => transactionController.create(req, res));
  router.get('/', (req, res) => transactionController.list(req, res));
  router.get('/:id', (req, res) => transactionController.get(req, res));
  router.put('/:id', (req, res) => transactionController.update(req, res));
  router.delete('/:id', (req, res) => transactionController.delete(req, res));

  return router;
}