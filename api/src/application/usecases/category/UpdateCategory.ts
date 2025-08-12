import { Category } from '../../../domain/entities/category';
import { CategoryRepository } from '../../../domain/ports/repositories/CategoryRepository';

export interface UpdateCategoryData {
  name: string;
}

export class UpdateCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, userId: string, data: UpdateCategoryData): Promise<Category> {
    // Verificar se a categoria existe e pertence ao usuário
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (existingCategory.userId !== userId) {
      throw new Error('Access denied - Category does not belong to user');
    }

    // Verificar se já existe uma categoria com o mesmo nome para o usuário
    const categoriesWithSameName = await this.categoryRepository.findByUserId(userId);
    const duplicateCategory = categoriesWithSameName.find(
      (cat: Category) => cat.name.toLowerCase() === data.name.toLowerCase() && cat.id !== id
    );

    if (duplicateCategory) {
      throw new Error('Category name already exists for this user');
    }

    // Atualizar categoria
    const updatedCategory = await this.categoryRepository.update(id, {
      name: data.name,
      userId: existingCategory.userId
    });

    if (!updatedCategory) {
      throw new Error('Failed to update category');
    }

    return updatedCategory;
  }
}
