export interface Category {
  id: string; // UUID
  userId?: string | null; // UUID
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}