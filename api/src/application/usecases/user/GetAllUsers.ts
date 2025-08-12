import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/repositories/UserRepository';

export class GetAllUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    // Este use case é tipicamente para administradores
    const users = await this.userRepository.findAll();
    return users;
  }
}
