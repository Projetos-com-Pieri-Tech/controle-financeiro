import { Account } from '../../../domain/entities/account';
import { AccountRepository } from '../../../domain/ports/repositories/AccountRepository';

export class GetAccountById {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Account | null> {
    const account = await this.accountRepository.findById(accountId);
    return account;
  }
}
