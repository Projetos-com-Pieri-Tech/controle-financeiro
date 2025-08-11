import { Category } from '../../entities/category';
import { CategoryRepository } from '../../ports/CategoryRepository';

export class GetCategoriesByUser {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(userId: string | null): Promise<Category[]> {
    const categories = await this.categoryRepository.findByUserId(userId);
    return categories;
  }
}
