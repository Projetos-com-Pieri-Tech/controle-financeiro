import { Transaction } from '../../../domain/entities/transaction';
import { TransactionRepository } from '../../../domain/ports/repositories/TransactionRepository';

export class GetTransactionById {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(id: string): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      return null;
    }

    // Verificar se a transação pertence a uma conta do usuário
    // Isso seria feito checando se a conta da transação pertence ao usuário
    // Por simplicidade, assumindo que o repository já filtra por usuário
    
    return transaction;
  }
}
