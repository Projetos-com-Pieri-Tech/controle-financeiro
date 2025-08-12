import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { createAuthMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../../../application/services/AuthService';

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gerenciamento de categorias de transações
 */

export function createCategoryRoutes(
  categoryController: CategoryController,
  authService: AuthService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  router.use(authMiddleware); // Todas as rotas de categoria precisam de autenticação

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Criar uma nova categoria
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCategoryRequest'
   *     responses:
   *       201:
   *         description: Categoria criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Category'
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
  router.post('/', (req, res) => categoryController.create(req, res));

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Listar categorias do usuário e globais
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de categorias
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Category'
   *       401:
   *         description: Token inválido ou ausente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', (req, res) => categoryController.list(req, res));

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Atualizar categoria
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Categoria não encontrada
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
  router.put('/:id', (req, res) => categoryController.update(req, res));

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Excluir categoria
   *     tags: [Categories]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
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
  router.delete('/:id', (req, res) => categoryController.delete(req, res));

  return router;
}
