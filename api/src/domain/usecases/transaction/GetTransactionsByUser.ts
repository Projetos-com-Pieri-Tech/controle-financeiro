import { Transaction } from '../../entities/transaction';
import { TransactionRepository, TransactionFilters } from '../../ports/TransactionRepository';

export class GetTransactionsByUser {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(userId: string, filters?: Omit<TransactionFilters, 'userId'>): Promise<Transaction[]> { // UUID
    const fullFilters: TransactionFilters = {
      ...filters,
      userId
    };

    return await this.transactionRepository.findByFilters(fullFilters);
  }
}