import { Transaction } from '../../entities/transaction';
import { BaseRepository } from './BaseRepository';

export interface TransactionFilters {
  userId?: string; // UUID
  accountId?: string; // UUID
  categoryId?: string; // UUID
  type?: string;
  startDate?: Date;
  endDate?: Date;
  isPaid?: boolean;
}

export interface TransactionRepository extends BaseRepository<Transaction> {
  findByUserId(userId: string): Promise<Transaction[]>; // UUID
  findByAccountId(accountId: string): Promise<Transaction[]>; // UUID
  findByCategoryId(categoryId: string): Promise<Transaction[]>; // UUID
  findByFilters(filters: TransactionFilters): Promise<Transaction[]>;
}
