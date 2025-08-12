import { User } from '../../entities/user';
import { BaseRepository } from './BaseRepository';

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
