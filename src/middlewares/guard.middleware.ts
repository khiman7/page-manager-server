import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from '../interfaces/middleware.interface';

export class GuardMiddleware implements IMiddleware {
	execute(request: Request, response: Response, next: NextFunction): void {
		if (request.user) {
			return next();
		}

		response.status(401).send({ message: 'Unauthorized' });
	}
}
