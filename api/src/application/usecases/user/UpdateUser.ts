import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/repositories/UserRepository';

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, data: UpdateUserData): Promise<User> {
    // Verificar se o usuário existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Se está atualizando o email, verificar se já existe
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(data.email);
      if (userWithEmail) {
        throw new Error('Email already exists');
      }
    }

    // Atualizar usuário
    const updatedUser = await this.userRepository.update(id, {
      name: data.name || existingUser.name,
      email: data.email || existingUser.email,
      passwordHash: existingUser.passwordHash,
      roleId: existingUser.roleId
    });

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }
}
