import { TransactionType } from '../enums';

export interface Transaction {
  id: string; // UUID
  userId: string; // UUID
  accountId: string; // UUID
  categoryId?: string | null; // UUID
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: Date;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}