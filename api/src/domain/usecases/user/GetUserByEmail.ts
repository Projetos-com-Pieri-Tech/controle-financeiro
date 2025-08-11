import { User } from '../../entities/user';
import { UserRepository } from '../../ports/UserRepository';

export class GetUserByEmail {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }
}
