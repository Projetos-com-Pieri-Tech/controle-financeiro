import bcrypt from 'bcrypt';
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/repositories/UserRepository';

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  roleId?: string; // UUID, opcional (usa role padrão)
}

export class RegisterUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: RegisterUserData): Promise<User> {
    // Verificar se o email já existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Role padrão para usuário comum se não fornecida
    const roleId = data.roleId || '3e1e1e1e-1111-4111-8111-111111111112';

    // Criar usuário
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      roleId,
      deletedAt: null
    });

    return user;
  }
}
