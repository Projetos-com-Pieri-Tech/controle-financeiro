import { Router } from 'express';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/authorizationMiddleware';
import { Container } from '../config/container';

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Operações administrativas (requer permissão de admin)
 */

export function createAdminRoutes(container: Container) {
  const router = Router();
  const adminController = container.adminController;

  // Criar middleware de autenticação
  const authMiddleware = createAuthMiddleware(container.authService);

  // Todas as rotas admin requerem autenticação + role de admin
  router.use(authMiddleware);
  router.use(requireAdmin);

  /**
   * @swagger
   * /api/admin/stats:
   *   get:
   *     summary: Obter estatísticas do sistema
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Estatísticas do sistema
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalUsers:
   *                   type: integer
   *                   example: 150
   *                 totalAccounts:
   *                   type: integer
   *                   example: 300
   *                 totalTransactions:
   *                   type: integer
   *                   example: 5000
   *                 totalCategories:
   *                   type: integer
   *                   example: 25
   *                 totalRevenue:
   *                   type: number
   *                   format: decimal
   *                   example: 125000.75
   *                 totalExpenses:
   *                   type: number
   *                   format: decimal
   *                   example: 95000.50
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.get('/stats', adminController.getSystemStats.bind(adminController));

  /**
   * @swagger
   * /api/admin/users:
   *   get:
   *     summary: Listar todos os usuários
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuários
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.get('/users', adminController.getAllUsers.bind(adminController));

  /**
   * @swagger
   * /api/admin/users/activity:
   *   get:
   *     summary: Obter atividade dos usuários
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Atividade dos usuários
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   userId:
   *                     type: string
   *                     format: uuid
   *                   name:
   *                     type: string
   *                   lastAccess:
   *                     type: string
   *                     format: date-time
   *                   transactionCount:
   *                     type: integer
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.get('/users/activity', adminController.getUserActivity.bind(adminController));

  /**
   * @swagger
   * /api/admin/users/{userId}/role:
   *   put:
   *     summary: Atualizar role de um usuário
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID do usuário
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [roleId]
   *             properties:
   *               roleId:
   *                 type: string
   *                 format: uuid
   *                 example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
   *     responses:
   *       200:
   *         description: Role atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: Usuário não encontrado
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.put('/users/:userId/role', adminController.updateUserRole.bind(adminController));

  /**
   * @swagger
   * /api/admin/users/{userId}:
   *   delete:
   *     summary: Excluir usuário
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID do usuário
   *     responses:
   *       200:
   *         description: Usuário excluído com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Usuário excluído com sucesso"
   *       404:
   *         description: Usuário não encontrado
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.delete('/users/:userId', adminController.deleteUser.bind(adminController));

  /**
   * @swagger
   * /api/admin/categories:
   *   get:
   *     summary: Listar categorias globais
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de categorias globais
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Category'
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.get('/categories', adminController.getGlobalCategories.bind(adminController));

  /**
   * @swagger
   * /api/admin/categories:
   *   post:
   *     summary: Criar categoria global
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name]
   *             properties:
   *               name:
   *                 type: string
   *                 example: 'Transporte'
   *     responses:
   *       201:
   *         description: Categoria global criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.post('/categories', adminController.createGlobalCategory.bind(adminController));

  /**
   * @swagger
   * /api/admin/categories/{categoryId}:
   *   put:
   *     summary: Atualizar categoria global
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da categoria
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCategoryRequest'
   *     responses:
   *       200:
   *         description: Categoria atualizada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
   *       404:
   *         description: Categoria não encontrada
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.put('/categories/:categoryId', adminController.updateGlobalCategory.bind(adminController));

  /**
   * @swagger
   * /api/admin/categories/{categoryId}:
   *   delete:
   *     summary: Excluir categoria global
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID da categoria
   *     responses:
   *       200:
   *         description: Categoria excluída com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Categoria excluída com sucesso"
   *       404:
   *         description: Categoria não encontrada
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.delete('/categories/:categoryId', adminController.deleteGlobalCategory.bind(adminController));

  /**
   * @swagger
   * /api/admin/transactions:
   *   get:
   *     summary: Listar todas as transações do sistema
   *     tags: [Admin]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Número da página
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Número de itens por página
   *     responses:
   *       200:
   *         description: Lista de transações
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 transactions:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Transaction'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     total:
   *                       type: integer
   *                     page:
   *                       type: integer
   *                     limit:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       401:
   *         description: Token inválido ou ausente
   *       403:
   *         description: Acesso negado - requer permissão de admin
   */
  router.get('/transactions', adminController.getAllTransactions.bind(adminController));

  return router;
}
