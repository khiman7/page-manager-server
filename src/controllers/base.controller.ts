import { Router } from 'express';
import { injectable } from 'inversify';

import { ILogger } from '../interfaces/logger.interface';
import { IRoute } from '../interfaces/route.interface';

@injectable()
export abstract class Controller {
	private readonly _router: Router;
	private logger: ILogger;

	constructor(logger: ILogger) {
		this.logger = logger;
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.info(`✅ [${route.method.toUpperCase()}] ${route.path}`);

			const middlewares = route.middlewares?.map((middleware) =>
				middleware.execute.bind(middleware),
			);
			const handler = route.handler.bind(this);
			const pipeline = middlewares ? [...middlewares, handler] : handler;

			this.router[route.method](route.path, pipeline);
		}
	}
}
