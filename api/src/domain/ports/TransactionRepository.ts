import { Transaction } from '../entities/transaction';

export interface TransactionFilters {
  userId?: number;
  accountId?: number;
  categoryId?: number;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  isPaid?: boolean;
}

export interface TransactionRepository {
  findById(id: number): Promise<Transaction | null>;
  findByUserId(userId: number): Promise<Transaction[]>;
  findByAccountId(accountId: number): Promise<Transaction[]>;
  findByCategoryId(categoryId: number): Promise<Transaction[]>;
  findByFilters(filters: TransactionFilters): Promise<Transaction[]>;
  create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction>;
  update(id: number, transaction: Partial<Transaction>): Promise<Transaction | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<Transaction[]>;
}