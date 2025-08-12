import { Category } from '../../../domain/entities/category';
import { CategoryRepository } from '../../../domain/ports/repositories/CategoryRepository';

export class GetCategoryById {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, userId: string): Promise<Category | null> {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      return null;
    }

    // Verificar se a categoria pertence ao usuário
    if (category.userId !== userId) {
      throw new Error('Category not found or access denied');
    }

    return category;
  }
}
