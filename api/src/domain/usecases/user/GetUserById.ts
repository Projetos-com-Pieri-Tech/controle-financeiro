import { User } from '../../entities/user';
import { UserRepository } from '../../ports/UserRepository';

export class GetUserById {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    return user;
  }
}
