import { AccountType } from '../../../domain/enums';

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  initialBalance?: number;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: AccountType;
}

export interface AccountResponse {
  id: string; // UUID
  userId: string; // UUID
  name: string;
  type: AccountType;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface AccountListResponse {
  accounts: AccountResponse[];
  total: number;
}

export interface AccountBalanceResponse {
  accountId: string; // UUID
  balance: number;
  lastUpdated: Date;
}
