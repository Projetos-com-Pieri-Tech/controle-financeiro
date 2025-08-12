import { Transaction } from '../entities/transaction';
import { TransactionRepository } from '../ports/TransactionRepository';
import { AccountRepository } from '../ports/AccountRepository';
import { CategoryRepository } from '../ports/CategoryRepository';
import { UpdateTransactionDTO } from '../../application/dtos/transaction';

export class UpdateTransaction {
  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async execute(data: UpdateTransactionDTO): Promise<Transaction | null> {
    // Verificar se a transação existe e pertence ao usuário
    await this.validateExistingTransaction(data);

    // Validar nova conta se fornecida
    if (data.accountId) {
      await this.validateAccountIfProvided(data);
    }

    // Validar nova categoria se fornecida
    if (data.categoryId !== undefined) {
      await this.validateCategoryIfProvided(data);
    }

    // Validar valor se fornecido
    this.validateAmountIfProvided(data);

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

  private async validateExistingTransaction(data: UpdateTransactionDTO): Promise<void> {
    const transaction = await this.transactionRepository.findById(data.transactionId);
    if (!transaction || transaction.userId !== data.userId) {
      throw new Error('Transaction not found or does not belong to user');
    }
  }

  private async validateAccountIfProvided(data: UpdateTransactionDTO): Promise<void> {
    const account = await this.accountRepository.findById(data.accountId!);
    if (!account || account.userId !== data.userId) {
      throw new Error('Account not found or does not belong to user');
    }
  }

  private async validateCategoryIfProvided(data: UpdateTransactionDTO): Promise<void> {
    if (data.categoryId !== null) {
      const category = await this.categoryRepository.findById(data.categoryId!);
      if (!category) {
        throw new Error('Category not found');
      }
      if (category.userId && category.userId !== data.userId) {
        throw new Error('Category does not belong to user');
      }
    }
  }

  private validateAmountIfProvided(data: UpdateTransactionDTO): void {
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error('Amount must be positive');
    }
  }
}