import { Account } from '../../entities/account';
import { AccountRepository } from '../../ports/AccountRepository';
import { UpdateAccountRequest } from '../../../application/dtos';

export class UpdateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string, data: UpdateAccountRequest): Promise<Account | null> {
    const updatedAccount = await this.accountRepository.update(accountId, data);
    return updatedAccount;
  }
}
