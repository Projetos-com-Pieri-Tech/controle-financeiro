import { Response } from 'express';
import { AdminService } from '../../../application/services/AdminService';
import { User } from '../../../domain/entities/user';
import { Transaction } from '../../../domain/entities/transaction';
import { AuthRequest } from '../../../application/dtos';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  async getSystemStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await this.adminService.getSystemStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get system statistics',
        message: error.message
      });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await this.adminService.getAllUsers();
      
      // Remover senha hash dos dados retornados
      const safeUsers = users.map((user: User) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      res.json({
        success: true,
        data: safeUsers,
        count: safeUsers.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get users',
        message: error.message
      });
    }
  }

  async getUserActivity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const activities = await this.adminService.getUserActivity();
      res.json({
        success: true,
        data: activities
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get user activity',
        message: error.message
      });
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID'
        });
        return;
      }

      // Não permitir que admin delete a si mesmo
      if (req.user?.userId === userId) {
        res.status(400).json({
          success: false,
          error: 'Cannot delete your own account'
        });
        return;
      }

      const deleted = await this.adminService.deleteUser(userId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Failed to delete user',
        message: error.message
      });
    }
  }

  async updateUserRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      if (!userId || !roleId) {
        res.status(400).json({
          success: false,
          error: 'Invalid user ID or role ID'
        });
        return;
      }

      // Não permitir que admin altere seu próprio role
      if (req.user?.userId === userId) {
        res.status(400).json({
          success: false,
          error: 'Cannot change your own role'
        });
        return;
      }

      const updatedUser = await this.adminService.updateUserRole(userId, roleId);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          roleId: updatedUser.roleId
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Failed to update user role',
        message: error.message
      });
    }
  }

  async getGlobalCategories(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await this.adminService.getGlobalCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get global categories',
        message: error.message
      });
    }
  }

  async createGlobalCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Category name is required'
        });
        return;
      }

      const category = await this.adminService.createGlobalCategory(name.trim());
      res.status(201).json({
        success: true,
        message: 'Global category created successfully',
        data: category
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Failed to create global category',
        message: error.message
      });
    }
  }

  async updateGlobalCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;

      if (!categoryId || !name?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID or name'
        });
        return;
      }

      const updatedCategory = await this.adminService.updateGlobalCategory(categoryId, name.trim());
      
      if (!updatedCategory) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Global category updated successfully',
        data: updatedCategory
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Failed to update global category',
        message: error.message
      });
    }
  }

  async deleteGlobalCategory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
        return;
      }

      const deleted = await this.adminService.deleteGlobalCategory(categoryId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Global category deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'Failed to delete global category',
        message: error.message
      });
    }
  }

  async getAllTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50, type, startDate, endDate } = req.query;
      
      let transactions = await this.adminService.getAllTransactions();

      // Filtrar por tipo se especificado
      if (type && ['receita', 'despesa'].includes(type as string)) {
        transactions = transactions.filter((t: Transaction) => t.type === type);
      }

      // Filtrar por data se especificado
      if (startDate) {
        const start = new Date(startDate as string);
        transactions = transactions.filter((t: Transaction) => new Date(t.transactionDate) >= start);
      }

      if (endDate) {
        const end = new Date(endDate as string);
        transactions = transactions.filter((t: Transaction) => new Date(t.transactionDate) <= end);
      }

      // Paginação
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 50;
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedTransactions = transactions.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: paginatedTransactions,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(transactions.length / limitNum),
          totalItems: transactions.length,
          itemsPerPage: limitNum
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get transactions',
        message: error.message
      });
    }
  }
}
