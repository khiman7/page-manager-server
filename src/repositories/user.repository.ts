import { inject, injectable } from 'inversify';
import { User } from '@prisma/client';

import { Database } from '../database';
import { TYPES } from '../types';

@injectable()
export class UserRepository {
	constructor(@inject(TYPES.Database) private database: Database) {}

	async find(username: string): Promise<User | null> {
		const user: User | null = await this.database.client.user.findFirst({
			where: {
				username,
			},
		});

		return user;
	}
}
