import { Transaction } from '../../domain/entities/transaction';
import { TransactionRepository, TransactionFilters } from '../../domain/ports/TransactionRepository';
import { AccountRepository } from '../../domain/ports/AccountRepository';
import { CategoryRepository } from '../../domain/ports/CategoryRepository';
import { CreateTransaction, CreateTransactionDTO } from '../../domain/usecases/CreateTransaction';
import { UpdateTransaction, UpdateTransactionDTO } from '../../domain/usecases/UpdateTransaction';
import { DeleteTransaction } from '../../domain/usecases/DeleteTransaction';
import { GetTransactionsByUser } from '../../domain/usecases/GetTransactionsByUser';

export class TransactionService {
  private createTransaction: CreateTransaction;
  private updateTransaction: UpdateTransaction;
  private deleteTransaction: DeleteTransaction;
  private getTransactionsByUser: GetTransactionsByUser;

  constructor(
    private transactionRepository: TransactionRepository,
    private accountRepository: AccountRepository,
    private categoryRepository: CategoryRepository
  ) {
    this.createTransaction = new CreateTransaction(
      transactionRepository,
      accountRepository,
      categoryRepository
    );
    this.updateTransaction = new UpdateTransaction(
      transactionRepository,
      accountRepository,
      categoryRepository
    );
    this.deleteTransaction = new DeleteTransaction(transactionRepository);
    this.getTransactionsByUser = new GetTransactionsByUser(transactionRepository);
  }

  async create(data: CreateTransactionDTO): Promise<Transaction> {
    return await this.createTransaction.execute(data);
  }

  async update(data: UpdateTransactionDTO): Promise<Transaction | null> {
    return await this.updateTransaction.execute(data);
  }

  async delete(userId: number, transactionId: number): Promise<boolean> {
    return await this.deleteTransaction.execute(userId, transactionId);
  }

  async getUserTransactions(
    userId: number,
    filters?: Omit<TransactionFilters, 'userId'>
  ): Promise<Transaction[]> {
    return await this.getTransactionsByUser.execute(userId, filters);
  }

  async getTransaction(userId: number, transactionId: number): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction || transaction.userId !== userId) {
      return null;
    }
    return transaction;
  }
}