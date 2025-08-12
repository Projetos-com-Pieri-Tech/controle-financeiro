import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authRateLimiter } from '../middleware/rateLimiter';

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: Email único do usuário
 *           example: joao@email.com
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Senha do usuário (mínimo 6 caracteres)
 *           example: "123456"
 *         roleId:
 *           type: integer
 *           description: ID do papel do usuário (1=admin, 2=user)
 *           example: 2
 *           default: 2
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *           example: joao@email.com
 *         password:
 *           type: string
 *           description: Senha do usuário
 *           example: "123456"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: Token JWT para autenticação
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Registrar novo usuário
   *     description: Cria uma nova conta de usuário no sistema
   *     tags: [Autenticação]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Dados inválidos ou email já existe
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/register', authRateLimiter, (req, res) => authController.register(req, res));

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Fazer login
   *     description: Autentica um usuário e retorna um token JWT
   *     tags: [Autenticação]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Credenciais inválidas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/login', authRateLimiter, (req, res) => authController.login(req, res));

  return router;
}
