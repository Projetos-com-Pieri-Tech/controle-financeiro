import { Transaction } from '../../domain/entities/transaction';
import { TransactionRepository, TransactionFilters } from '../../domain/ports/TransactionRepository';
import { AccountRepository } from '../../domain/ports/AccountRepository';
import { CategoryRepository } from '../../domain/ports/CategoryRepository';
import { CreateTransaction } from '../../domain/usecases/transaction/CreateTransaction';
import { UpdateTransaction } from '../../domain/usecases/transaction/UpdateTransaction';
import { DeleteTransaction } from '../../domain/usecases/transaction/DeleteTransaction';
import { GetTransactionsByUser } from '../../domain/usecases/transaction/GetTransactionsByUser';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../dtos';

export class TransactionService {
  private readonly createTransaction: CreateTransaction;
  private readonly updateTransaction: UpdateTransaction;
  private readonly deleteTransaction: DeleteTransaction;
  private readonly getTransactionsByUser: GetTransactionsByUser;

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository
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

  async delete(userId: string, transactionId: string): Promise<boolean> { // UUID
    return await this.deleteTransaction.execute(userId, transactionId);
  }

  async getUserTransactions(
    userId: string, // UUID
    filters?: Omit<TransactionFilters, 'userId'>
  ): Promise<Transaction[]> {
    return await this.getTransactionsByUser.execute(userId, filters);
  }

  async getTransaction(userId: string, transactionId: string): Promise<Transaction | null> { // UUID
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction || transaction.userId !== userId) {
      return null;
    }
    return transaction;
  }
}