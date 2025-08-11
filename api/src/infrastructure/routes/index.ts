import { Router } from 'express';
import { createAuthRoutes } from './authRoutes';
import { createAccountRoutes } from './accountRoutes';
import { createTransactionRoutes } from './transactionRoutes';
import { createCategoryRoutes } from './categoryRoutes';
import { createAdminRoutes } from './adminRoutes';
import { AuthController } from '../adapters/controllers/AuthController';
import { AccountController } from '../adapters/controllers/AccountController';
import { TransactionController } from '../adapters/controllers/TransactionController';
import { CategoryController } from '../adapters/controllers/CategoryController';
import { AdminController } from '../adapters/controllers/AdminController';
import { AuthService } from '../../application/services/AuthService';
import { Container } from '../config/container';

export function createRoutes(container: Container): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  router.use('/auth', createAuthRoutes(container.authController));
  router.use('/accounts', createAccountRoutes(container.accountController, container.authService));
  router.use('/transactions', createTransactionRoutes(container.transactionController, container.authService));
  router.use('/categories', createCategoryRoutes(container.categoryController, container.authService));
  router.use('/admin', createAdminRoutes(container));

  return router;
}