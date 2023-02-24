import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { IExceptionFilter } from '../interfaces/exception-filter.interface';
import { ILogger } from '../interfaces/logger.interface';
import { TYPES } from '../types';
import { HTTPException } from './http-exception';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.Logger) private logger: ILogger) {}

	catch(
		error: Error | HTTPException,
		request: Request,
		response: Response,
		next: NextFunction,
	): void {
		if (error instanceof HTTPException) {
			this.logger.error(
				`❌ [${error.context?.toUpperCase()}] Error ${error.statusCode}: ${error.message}`,
			);
			response.status(error.statusCode).send({ message: error.message });
		} else {
			this.logger.error(`❌ ${error.message}`);
			response.status(500).send({ message: error.message });
		}
	}
}
