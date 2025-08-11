import { TransactionType } from '../../../domain/enums';

export interface CreateTransactionRequest {
  accountId: string; // UUID
  categoryId?: string; // UUID
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: Date;
  isPaid?: boolean;
}

export interface UpdateTransactionRequest {
  accountId?: string; // UUID
  categoryId?: string | null; // UUID
  description?: string;
  amount?: number;
  type?: TransactionType;
  transactionDate?: Date;
  isPaid?: boolean;
}

export interface TransactionResponse {
  id: string; // UUID
  userId: string; // UUID
  accountId: string; // UUID
  categoryId?: string | null; // UUID
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: Date;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface TransactionListResponse {
  transactions: TransactionResponse[];
  total: number;
}

export interface TransactionFiltersRequest {
  accountId?: string; // UUID
  categoryId?: string; // UUID
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  isPaid?: boolean;
  page?: number;
  limit?: number;
}

// DTOs para use cases
export interface CreateTransactionDTO {
  userId: string; // UUID
  accountId: string; // UUID
  categoryId?: string; // UUID
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: Date;
  isPaid?: boolean;
}

export interface UpdateTransactionDTO {
  userId: string; // UUID
  transactionId: string; // UUID
  accountId?: string; // UUID
  categoryId?: string | null; // UUID
  description?: string;
  amount?: number;
  type?: TransactionType;
  transactionDate?: Date;
  isPaid?: boolean;
}
