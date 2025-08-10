import { TransactionRepository } from '../ports/TransactionRepository';

export class DeleteTransaction {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(userId: number, transactionId: number): Promise<boolean> {
    // Verificar se a transação existe e pertence ao usuário
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction || transaction.userId !== userId) {
      throw new Error('Transaction not found or does not belong to user');
    }

    // Soft delete
    return await this.transactionRepository.delete(transactionId);
  }
}