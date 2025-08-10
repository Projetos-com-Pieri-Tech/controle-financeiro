import { Router } from 'express';
import { AuthController } from '../adapters/controllers/AuthController';
import { authRateLimiter } from '../middleware/rateLimiter';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/register', authRateLimiter, (req, res) => authController.register(req, res));
  router.post('/login', authRateLimiter, (req, res) => authController.login(req, res));

  return router;
}