import { Account } from '../entities/account';

export interface AccountRepository {
  findById(id: number): Promise<Account | null>;
  findByUserId(userId: number): Promise<Account[]>;
  create(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account>;
  update(id: number, account: Partial<Account>): Promise<Account | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<Account[]>;
}