import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../types';
import { ILogger } from '../interfaces/logger.interface';
import { IDatabase } from '../interfaces/database.interface';

@injectable()
export class Database implements IDatabase {
	public readonly client: PrismaClient;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.info('✅ [DB] Successfully connected to the database');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(
					`❌ [DB] An error occured while connecting to the database: ${error.message}`,
				);
			}
		}
	}

	async disconnect(): Promise<void> {
		this.client.$disconnect();
	}
}
