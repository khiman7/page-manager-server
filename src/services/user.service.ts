import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { UserRepository } from '../repositories/user.repository';
import { TYPES } from '../types';

@injectable()
export class UserService {
	constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

	async getByUsername(username: string): Promise<User | null> {
		const user = await this.userRepository.find(username);

		return user;
	}
}
