import { Transaction } from '../../../domain/entities/transaction';
import { TransactionRepository, TransactionFilters } from '../../../domain/ports/repositories/TransactionRepository';

export class GetTransactionsByUser {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(userId: string, filters?: Omit<TransactionFilters, 'userId'>): Promise<Transaction[]> { // UUID
    const fullFilters: TransactionFilters = {
      ...filters,
      userId
    };

    return await this.transactionRepository.findByFilters(fullFilters);
  }
}
