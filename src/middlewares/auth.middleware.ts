import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IMiddleware } from '../interfaces/middleware.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(request: Request, response: Response, next: NextFunction): void {
		if (request.headers.authorization) {
			const token = request.headers.authorization.split(' ')[1];

			jwt.verify(token, this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (payload) {
					if (typeof payload !== 'string') {
						request.user = payload.username;
						next();
					}
				}
			});
		} else {
			next();
		}
	}
}
