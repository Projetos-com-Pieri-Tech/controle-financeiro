import { Router } from 'express';
import { TransactionController } from '../adapters/controllers/TransactionController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../application/services/AuthService';

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Gerenciamento de transações financeiras
 */

export function createTransactionRoutes(
  transactionController: TransactionController,
  authService: AuthService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.use(authMiddleware); // Todas as rotas de transação precisam de autenticação

  /**
   * @swagger
   * /api/transactions:
   *   post:
   *     summary: Criar uma nova transação
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTransactionRequest'
   *     responses:
   *       201:
   *         description: Transação criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Transaction'
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
  router.post('/', (req, res) => transactionController.create(req, res));

  /**
   * @swagger
   * /api/transactions:
   *   get:
   *     summary: Listar transações do usuário
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: accountId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filtrar por conta específica
   *       - in: query
   *         name: categoryId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filtrar por categoria específica
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [receita, despesa]
   *         description: Filtrar por tipo de transação
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Data inicial para filtro
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Data final para filtro
   *       - in: query
   *         name: isPaid
   *         schema:
   *           type: boolean
   *         description: Filtrar por status de pagamento
   *     responses:
   *       200:
   *         description: Lista de transações
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Transaction'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', (req, res) => transactionController.list(req, res));

  /**
   * @swagger
   * /api/transactions/{id}:
   *   get:
   *     summary: Obter transação por ID
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da transação
   *     responses:
   *       200:
   *         description: Transação encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Transaction'
   *       404:
   *         description: Transação não encontrada
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
  router.get('/:id', (req, res) => transactionController.get(req, res));

  /**
   * @swagger
   * /api/transactions/{id}:
   *   put:
   *     summary: Atualizar transação
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da transação
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTransactionRequest'
   *     responses:
   *       200:
   *         description: Transação atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Transaction'
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Transação não encontrada
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
  router.put('/:id', (req, res) => transactionController.update(req, res));

  /**
   * @swagger
   * /api/transactions/{id}:
   *   delete:
   *     summary: Excluir transação
   *     tags: [Transactions]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da transação
   *     responses:
   *       200:
   *         description: Transação excluída com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Transação excluída com sucesso"
   *       404:
   *         description: Transação não encontrada
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
  router.delete('/:id', (req, res) => transactionController.delete(req, res));

  return router;
}