import { Transaction } from '../entities/transaction';
import { TransactionRepository } from '../ports/TransactionRepository';
import { AccountRepository } from '../ports/AccountRepository';
import { CategoryRepository } from '../ports/CategoryRepository';

export interface UpdateTransactionDTO {
  userId: number;
  transactionId: number;
  accountId?: number;
  categoryId?: number | null;
  description?: string;
  amount?: number;
  type?: string;
  transactionDate?: Date;
  isPaid?: boolean;
}

export class UpdateTransaction {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(data: UpdateTransactionDTO): Promise<Transaction | null> {
    // Verificar se a transação existe e pertence ao usuário
    const transaction = await this.transactionRepository.findById(data.transactionId);
    if (!transaction || transaction.userId !== data.userId) {
      throw new Error('Transaction not found or does not belong to user');
    }

    // Validar nova conta se fornecida
    if (data.accountId) {
      const account = await this.accountRepository.findById(data.accountId);
      if (!account || account.userId !== data.userId) {
        throw new Error('Account not found or does not belong to user');
      }
    }

    // Validar nova categoria se fornecida
    if (data.categoryId !== undefined) {
      if (data.categoryId !== null) {
        const category = await this.categoryRepository.findById(data.categoryId);
        if (!category) {
          throw new Error('Category not found');
        }
        if (category.userId && category.userId !== data.userId) {
          throw new Error('Category does not belong to user');
        }
      }
    }

    // Validar valor se fornecido
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // Atualizar transação
    const updatedTransaction = await this.transactionRepository.update(
      data.transactionId,
      {
        accountId: data.accountId,
        categoryId: data.categoryId,
        description: data.description,
        amount: data.amount,
        type: data.type as any,
        transactionDate: data.transactionDate,
        isPaid: data.isPaid
      }
    );

    return updatedTransaction;
  }
}