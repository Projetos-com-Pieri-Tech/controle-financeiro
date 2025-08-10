export interface Category {
  id: number;
  userId?: number | null;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}