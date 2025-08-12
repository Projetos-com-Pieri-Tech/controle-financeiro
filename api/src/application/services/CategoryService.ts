import { Category } from '../../domain/entities/category';
import { CategoryRepository } from '../../domain/ports/CategoryRepository';

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(name: string, userId?: string): Promise<Category> { // UUID
    // Verificar se já existe uma categoria com o mesmo nome para o usuário
    const existingCategory = await this.categoryRepository.findByName(name, userId);
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const category = await this.categoryRepository.create({
      name,
      userId: userId || null,
      deletedAt: null
    });

    return category;
  }

  async getUserCategories(userId: string): Promise<Category[]> { // UUID
    // Buscar categorias do usuário e categorias globais (userId = null)
    const userCategories = await this.categoryRepository.findByUserId(userId);
    const globalCategories = await this.categoryRepository.findByUserId(null);
    
    return [...globalCategories, ...userCategories];
  }

  async updateCategory(
    userId: string, // UUID
    categoryId: string, // UUID
    name: string
  ): Promise<Category | null> {
    // Verificar se a categoria existe e pertence ao usuário
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Só pode editar categorias próprias, não as globais
    if (category.userId !== userId) {
      throw new Error('Cannot edit this category');
    }

    return await this.categoryRepository.update(categoryId, { name });
  }

  async deleteCategory(userId: string, categoryId: string): Promise<boolean> { // UUID
    // Verificar se a categoria existe e pertence ao usuário
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    
    // Só pode deletar categorias próprias, não as globais
    if (category.userId !== userId) {
      throw new Error('Cannot delete this category');
    }

    return await this.categoryRepository.delete(categoryId);
  }
}