import { Account } from '../../../domain/entities/account';
import { AccountRepository } from '../../../domain/ports/repositories/AccountRepository';
import { CreateAccountRequest } from '../../../application/dtos';

export class CreateAccount {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(userId: string, data: CreateAccountRequest): Promise<Account> {
    const account = await this.accountRepository.create({
      userId: userId,
      name: data.name,
      type: data.type,
      initialBalance: data.initialBalance || 0
    });

    return account;
  }
}
