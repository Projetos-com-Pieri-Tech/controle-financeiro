import { Router } from 'express';
import { createAuthRoutes } from './authRoutes';
import { createAccountRoutes } from './accountRoutes';
import { createTransactionRoutes } from './transactionRoutes';
import { createCategoryRoutes } from './categoryRoutes';
import { AuthController } from '../adapters/controllers/AuthController';
import { AccountController } from '../adapters/controllers/AccountController';
import { TransactionController } from '../adapters/controllers/TransactionController';
import { CategoryController } from '../adapters/controllers/CategoryController';
import { AuthService } from '../../application/services/AuthService';

interface RouteConfig {
  authController: AuthController;
  accountController: AccountController;
  transactionController: TransactionController;
  categoryController: CategoryController;
  authService: AuthService;
}

export function createRoutes(config: RouteConfig): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  router.use('/auth', createAuthRoutes(config.authController));
  router.use('/accounts', createAccountRoutes(config.accountController, config.authService));
  router.use('/transactions', createTransactionRoutes(config.transactionController, config.authService));
  router.use('/categories', createCategoryRoutes(config.categoryController, config.authService));

  return router;
}