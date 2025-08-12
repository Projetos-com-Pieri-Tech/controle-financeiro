import { Account } from '../../../domain/entities/account';
import { AccountRepository } from '../../../domain/ports/repositories/AccountRepository';
import { UpdateAccountRequest } from '../../../application/dtos';

export class UpdateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string, data: UpdateAccountRequest): Promise<Account | null> {
    const updatedAccount = await this.accountRepository.update(accountId, data);
    return updatedAccount;
  }
}
