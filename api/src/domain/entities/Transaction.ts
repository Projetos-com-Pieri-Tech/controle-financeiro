export enum TransactionType {
  RECEITA = 'receita',
  DESPESA = 'despesa'
}

export interface Transaction {
  id: number;
  userId: number;
  accountId: number;
  categoryId?: number | null;
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: Date;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}