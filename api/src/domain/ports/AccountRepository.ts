import { Account } from '../entities/account';
import { BaseRepository } from './BaseRepository';

export interface AccountRepository extends BaseRepository<Account> {
  findByUserId(userId: string): Promise<Account[]>; // UUID
}