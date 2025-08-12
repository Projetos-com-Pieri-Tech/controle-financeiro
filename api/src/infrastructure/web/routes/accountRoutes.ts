import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../../application/services/AuthService';

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Gerenciamento de contas financeiras
 */

export function createAccountRoutes(
  accountController: AccountController,
  authService: AuthService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.use(authMiddleware); // Todas as rotas de conta precisam de autenticação

  /**
   * @swagger
   * /api/accounts:
   *   post:
   *     summary: Criar uma nova conta
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAccountRequest'
   *     responses:
   *       201:
   *         description: Conta criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Account'
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/', (req, res) => accountController.create(req, res));

  /**
   * @swagger
   * /api/accounts:
   *   get:
   *     summary: Listar contas do usuário
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de contas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Account'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', (req, res) => accountController.list(req, res));

  /**
   * @swagger
   * /api/accounts/{id}:
   *   get:
   *     summary: Obter conta por ID com saldo
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da conta
   *     responses:
   *       200:
   *         description: Conta encontrada
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/Account'
   *                 - type: object
   *                   properties:
   *                     balance:
   *                       type: number
   *                       format: decimal
   *                       example: 1245.75
   *       404:
   *         description: Conta não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id', (req, res) => accountController.getWithBalance(req, res));

  /**
   * @swagger
   * /api/accounts/{id}/balance:
   *   get:
   *     summary: Obter saldo da conta
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da conta
   *     responses:
   *       200:
   *         description: Saldo da conta
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AccountBalanceResponse'
   *       404:
   *         description: Conta não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:id/balance', (req, res) => accountController.getWithBalance(req, res)); // Endpoint específico para balance

  /**
   * @swagger
   * /api/accounts/{id}:
   *   put:
   *     summary: Atualizar conta
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da conta
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAccountRequest'
   *     responses:
   *       200:
   *         description: Conta atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Account'
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Conta não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/:id', (req, res) => accountController.update(req, res));

  /**
   * @swagger
   * /api/accounts/{id}:
   *   delete:
   *     summary: Excluir conta
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da conta
   *     responses:
   *       200:
   *         description: Conta excluída com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Conta excluída com sucesso"
   *       404:
   *         description: Conta não encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', (req, res) => accountController.delete(req, res));

  return router;
}
