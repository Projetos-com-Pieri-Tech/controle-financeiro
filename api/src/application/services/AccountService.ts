import { Account } from '../../domain/entities/account';
import { AccountRepository } from '../../domain/ports/AccountRepository';
import { GetAccountBalance } from '../../domain/usecases/account/GetAccountBalance';
import { TransactionRepository } from '../../domain/ports/TransactionRepository';

export class AccountService {
  private readonly getAccountBalance: GetAccountBalance;

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository
  ) {
    this.getAccountBalance = new GetAccountBalance(accountRepository, transactionRepository);
  }

  async createAccount(
    userId: string, // UUID
    name: string,
    type: string,
    initialBalance: number = 0
  ): Promise<Account> {
    const account = await this.accountRepository.create({
      userId,
      name,
      type: type as any,
      initialBalance,
      deletedAt: null
    });

    return account;
  }

  async getUserAccounts(userId: string): Promise<Account[]> { // UUID
    return await this.accountRepository.findByUserId(userId);
  }

  async getAccountWithBalance(userId: string, accountId: string) { // UUID
    const balance = await this.getAccountBalance.execute(userId, accountId);
    return balance;
  }

  async updateAccount(
    userId: string, // UUID
    accountId: string, // UUID
    data: Partial<Account>
  ): Promise<Account | null> {
    // Verificar se a conta pertence ao usuário
    const account = await this.accountRepository.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new Error('Account not found or does not belong to user');
    }

    return await this.accountRepository.update(accountId, data);
  }

  async deleteAccount(userId: string, accountId: string): Promise<boolean> { // UUID
    // Verificar se a conta pertence ao usuário
    const account = await this.accountRepository.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new Error('Account not found or does not belong to user');
    }

    // Verificar se existem transações na conta
    const transactions = await this.transactionRepository.findByAccountId(accountId);
    if (transactions.length > 0) {
      throw new Error('Cannot delete account with existing transactions');
    }

    return await this.accountRepository.delete(accountId);
  }
}