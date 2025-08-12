import { Router } from 'express';
import { createAuthRoutes } from './authRoutes';
import { createAccountRoutes } from './accountRoutes';
import { createTransactionRoutes } from './transactionRoutes';
import { createCategoryRoutes } from './categoryRoutes';
import { createAdminRoutes } from './adminRoutes';
import { Container } from '../../config/container';

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

// Export individual route creators for modularity
export { createAuthRoutes } from './authRoutes';
export { createAccountRoutes } from './accountRoutes';
export { createTransactionRoutes } from './transactionRoutes';
export { createCategoryRoutes } from './categoryRoutes';
export { createAdminRoutes } from './adminRoutes';