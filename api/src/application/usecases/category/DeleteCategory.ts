import { CategoryRepository } from '../../../domain/ports/repositories/CategoryRepository';

export class DeleteCategory {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    // Verificar se a categoria existe e pertence ao usuário
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (existingCategory.userId !== userId) {
      throw new Error('Access denied - Category does not belong to user');
    }

    // TODO: Verificar se existem transações usando esta categoria
    // Se houver, pode ser interessante fazer soft delete ou transferir para "Sem categoria"
    
    // Deletar categoria
    const success = await this.categoryRepository.delete(id);
    if (!success) {
      throw new Error('Failed to delete category');
    }
  }
}
