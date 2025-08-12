import { Category } from '../../../domain/entities/category';
import { CategoryRepository } from '../../../domain/ports/repositories/CategoryRepository';
import { CreateCategoryRequest } from '../../../application/dtos';

export class CreateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string | null, data: CreateCategoryRequest): Promise<Category> {
    const category = await this.categoryRepository.create({
      name: data.name,
      userId: data.isGlobal ? null : userId
    });

    return category;
  }
}
