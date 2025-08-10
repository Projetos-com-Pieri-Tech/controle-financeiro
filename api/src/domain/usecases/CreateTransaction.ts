import { Transaction, TransactionType } from '../entities/transaction';
import { TransactionRepository } from '../ports/TransactionRepository';
import { AccountRepository } from '../ports/AccountRepository';
import { CategoryRepository } from '../ports/CategoryRepository';

export interface CreateTransactionDTO {
  userId: number;
  accountId: number;
  categoryId?: number;
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: Date;
  isPaid?: boolean;
}

export class CreateTransaction {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(data: CreateTransactionDTO): Promise<Transaction> {
    // Validar se a conta existe e pertence ao usuário
    const account = await this.accountRepository.findById(data.accountId);
    if (!account || account.userId !== data.userId) {
      throw new Error('Account not found or does not belong to user');
    }

    // Validar categoria se fornecida
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      // Verificar se a categoria é global ou pertence ao usuário
      if (category.userId && category.userId !== data.userId) {
        throw new Error('Category does not belong to user');
      }
    }

    // Validar valor
    if (data.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // Criar transação
    const transaction = await this.transactionRepository.create({
      userId: data.userId,
      accountId: data.accountId,
      categoryId: data.categoryId || null,
      description: data.description,
      amount: data.amount,
      type: data.type,
      transactionDate: data.transactionDate,
      isPaid: data.isPaid !== undefined ? data.isPaid : true,
      deletedAt: null
    });

    return transaction;
  }
}