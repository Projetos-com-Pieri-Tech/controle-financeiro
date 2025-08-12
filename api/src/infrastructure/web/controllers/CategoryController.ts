import { Response } from 'express';
import { CategoryService } from '../../../application/services/CategoryService';
import { AuthRequest } from '../../../application/dtos';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, isGlobal } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Missing required field: name' });
        return;
      }

      // Se isGlobal for true e o usuário for admin (roleId = "admin"), criar categoria global
      const categoryUserId = isGlobal && req.user!.roleId === "admin" ? undefined : req.user!.userId;

      const category = await this.categoryService.createCategory(name, categoryUserId);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const categories = await this.categoryService.getUserCategories(userId);
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const categoryId = req.params.id;
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Missing required field: name' });
        return;
      }

      const category = await this.categoryService.updateCategory(userId, categoryId, name);
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const categoryId = req.params.id;

      const success = await this.categoryService.deleteCategory(userId, categoryId);
      
      if (!success) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
