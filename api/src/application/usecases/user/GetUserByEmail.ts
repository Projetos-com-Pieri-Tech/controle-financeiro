import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/repositories/UserRepository';

export class GetUserByEmail {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }
}
