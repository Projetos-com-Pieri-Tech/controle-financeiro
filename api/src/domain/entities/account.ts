import { AccountType } from '../enums';

export interface Account {
  id: string; // UUID
  userId: string; // UUID
  name: string;
  type: AccountType;
  initialBalance: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}