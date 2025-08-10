import { Request, Response } from 'express';
import { AccountService } from '../../../application/services/AccountService';

interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    roleId: number;
  };
}

export class AccountController {
  constructor(private accountService: AccountService) {}

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, type, initialBalance } = req.body;
      const userId = req.user!.userId;

      if (!name || !type) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const account = await this.accountService.createAccount(
        userId,
        name,
        type,
        initialBalance || 0
      );

      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accounts = await this.accountService.getUserAccounts(userId);
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getWithBalance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accountId = parseInt(req.params.id);

      const balance = await this.accountService.getAccountWithBalance(userId, accountId);
      res.json(balance);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accountId = parseInt(req.params.id);
      const { name, type, initialBalance } = req.body;

      const account = await this.accountService.updateAccount(
        userId,
        accountId,
        { name, type, initialBalance }
      );

      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }

      res.json(account);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const accountId = parseInt(req.params.id);

      const success = await this.accountService.deleteAccount(userId, accountId);
      
      if (!success) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}