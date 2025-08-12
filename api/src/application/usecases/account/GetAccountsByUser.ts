import { Account } from '../../../domain/entities/account';
import { AccountRepository } from '../../../domain/ports/repositories/AccountRepository';

export class GetAccountsByUser {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(userId: string): Promise<Account[]> {
    const accounts = await this.accountRepository.findByUserId(userId);
    return accounts;
  }
}
