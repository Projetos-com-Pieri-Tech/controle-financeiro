import { Response } from 'express';
import { TransactionService } from '../../../application/services/TransactionService';
import { AuthRequest } from '../../../application/dtos';

export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const {
        accountId,
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        isPaid
      } = req.body;

      if (!accountId || !description || !amount || !type || !transactionDate) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const transaction = await this.transactionService.create({
        userId,
        accountId,
        categoryId,
        description,
        amount,
        type,
        transactionDate: new Date(transactionDate),
        isPaid
      });

      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const {
        accountId,
        categoryId,
        type,
        startDate,
        endDate,
        isPaid
      } = req.query;

      const filters: any = {};
      if (accountId) filters.accountId = parseInt(accountId as string);
      if (categoryId) filters.categoryId = parseInt(categoryId as string);
      if (type) filters.type = type;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (isPaid !== undefined) filters.isPaid = isPaid === 'true';

      const transactions = await this.transactionService.getUserTransactions(userId, filters);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async get(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const transactionId = req.params.id; // UUID string

      const transaction = await this.transactionService.getTransaction(userId, transactionId);
      
      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const transactionId = req.params.id; // UUID string
      const {
        accountId,
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        isPaid
      } = req.body;

      const updateData: any = {
        userId,
        transactionId
      };

      if (accountId !== undefined) updateData.accountId = accountId;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (description !== undefined) updateData.description = description;
      if (amount !== undefined) updateData.amount = amount;
      if (type !== undefined) updateData.type = type;
      if (transactionDate !== undefined) updateData.transactionDate = new Date(transactionDate);
      if (isPaid !== undefined) updateData.isPaid = isPaid;

      const transaction = await this.transactionService.update(updateData);
      
      if (!transaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const transactionId = req.params.id; // UUID string

      const success = await this.transactionService.delete(userId, transactionId);
      
      if (!success) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
