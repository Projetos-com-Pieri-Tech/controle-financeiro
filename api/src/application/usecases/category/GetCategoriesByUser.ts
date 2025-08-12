import { Category } from '../../../domain/entities/category';
import { CategoryRepository } from '../../../domain/ports/repositories/CategoryRepository';

export class GetCategoriesByUser {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string | null): Promise<Category[]> {
    const categories = await this.categoryRepository.findByUserId(userId);
    return categories;
  }
}
