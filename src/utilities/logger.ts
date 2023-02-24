import { Logger as TSLog, ILogObj } from 'tslog';
import { injectable } from 'inversify';

import { ILogger } from '../interfaces/logger.interface';

@injectable()
export class Logger implements ILogger {
	private logger: TSLog<ILogObj>;

	constructor() {
		this.logger = new TSLog({
			prettyLogTemplate:
				'{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}} [{{logLevelName}}] {{name}}',
		});
	}

	public info(message: string, meta?: Record<string, unknown>): void {
		this.logger.info(message);
	}

	public warn(message: string, meta?: Record<string, unknown>): void {
		this.logger.warn(message);
	}

	public error(message: string, meta?: Record<string, unknown>): void {
		this.logger.error(message);
	}
}
