import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../domain/ports/repositories/UserRepository';
import { LoginRequest } from '../../../application/dtos';

export class AuthenticateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: LoginRequest): Promise<User | null> {
    const user = await this.userRepository.findByEmail(data.email);
    
    if (!user) {
      return null;
    }

    // Note: Password verification should be done by the service layer
    // This use case just finds the user by email
    return user;
  }
}
