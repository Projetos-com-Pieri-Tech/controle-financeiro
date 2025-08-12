export interface CreateCategoryRequest {
  name: string;
  isGlobal?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export interface CategoryResponse {
  id: string; // UUID
  userId?: string | null; // UUID
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CategoryListResponse {
  categories: CategoryResponse[];
  total: number;
}
