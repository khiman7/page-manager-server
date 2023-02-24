import { Request, Response, NextFunction, Router } from 'express';

import { IMiddleware } from './middleware.interface';

export interface IRoute {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'put' | 'patch' | 'delete'>;
	middlewares?: IMiddleware[];
	handler(request: Request, response: Response, next: NextFunction): void;
}
