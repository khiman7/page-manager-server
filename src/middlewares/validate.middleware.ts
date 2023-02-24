import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { IMiddleware } from '../interfaces/middleware.interface';

export class ValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}

	execute(request: Request, response: Response, next: NextFunction): void {
		const instance = plainToInstance(this.classToValidate, request.body);
		const errors = validateSync(instance);

		if (errors.length > 0) {
			response.status(422).send(errors);
		} else {
			next();
		}
	}
}
