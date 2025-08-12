import { UserRepository } from '../../../domain/ports/repositories/UserRepository';

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // TODO: Verificar se existem contas/transações vinculadas
    // Pode ser necessário fazer soft delete ou transferir dados

    // Deletar usuário
    const success = await this.userRepository.delete(id);
    if (!success) {
      throw new Error('Failed to delete user');
    }
  }
}
