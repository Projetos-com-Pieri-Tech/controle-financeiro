import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/ports/repositories/UserRepository';

export interface AuthTokenPayload {
  userId: string; // UUID
  email: string;
  roleId: string; // UUID
}

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSecret: string
  ) {}

  async register(name: string, email: string, password: string, roleId: string): Promise<User> {
    // Verificar se o email já existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
      roleId,
      deletedAt: null
    });

    return user;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Buscar usuário
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Gerar token
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId
    };

    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });

    return { user, token };
  }

  verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
    } catch (error) {
      // Re-throw with more specific error information
      const message = error instanceof Error ? error.message : 'Invalid token';
      throw new Error(`Token verification failed: ${message}`);
    }
  }
}
