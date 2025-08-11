import { User } from '../../entities/user';
import { UserRepository } from '../../ports/UserRepository';
import { CreateUserRequest } from '../../../application/dtos';

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserRequest, passwordHash: string): Promise<User> {
    if (!data.roleId) {
      throw new Error('RoleId is required');
    }

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash: passwordHash,
      roleId: data.roleId
    });

    return user;
  }
}
