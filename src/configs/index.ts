import { config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { IConfig } from '../interfaces/config.interface';
import { ILogger } from '../interfaces/logger.interface';
import { TYPES } from '../types';

@injectable()
export class Config implements IConfig {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		const { parsed, error } = config();

		if (error) {
			this.logger.error('❌ [CONFIG] Unable to read .env file');
		} else {
			this.logger.info('✅ [CONFIG] .env config loaded successfully');
			this.config = parsed as DotenvParseOutput;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
