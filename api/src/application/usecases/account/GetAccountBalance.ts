import { AccountRepository } from '../../../domain/ports/repositories/AccountRepository';
import { TransactionRepository } from '../../../domain/ports/repositories/TransactionRepository';
import { TransactionType } from '../../../domain/enums';

export interface AccountBalance {
  accountId: string; // UUID
  accountName: string;
  initialBalance: number;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
}

export class GetAccountBalance {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly transactionRepository: TransactionRepository
  ) {}

  async execute(userId: string, accountId: string): Promise<AccountBalance> { // UUID
    // Verificar se a conta existe e pertence ao usuário
    const account = await this.accountRepository.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new Error('Account not found or does not belong to user');
    }

    // Buscar todas as transações pagas da conta
    const transactions = await this.transactionRepository.findByAccountId(accountId);
    const paidTransactions = transactions.filter(t => t.isPaid && !t.deletedAt);

    // Calcular totais
    const totalIncome = paidTransactions
      .filter(t => t.type === TransactionType.RECEITA)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = paidTransactions
      .filter(t => t.type === TransactionType.DESPESA)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const currentBalance = Number(account.initialBalance) + totalIncome - totalExpense;

    return {
      accountId: account.id,
      accountName: account.name,
      initialBalance: Number(account.initialBalance),
      totalIncome,
      totalExpense,
      currentBalance
    };
  }
}
