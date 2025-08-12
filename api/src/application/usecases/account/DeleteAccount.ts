import { AccountRepository } from '../../../domain/ports/repositories/AccountRepository';

export class DeleteAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<boolean> {
    const deleted = await this.accountRepository.delete(accountId);
    return deleted;
  }
}
