import { Server } from 'http';
import express, { Express } from 'express';
import cors from 'cors';
import { inject, injectable } from 'inversify';

import { ILogger } from './interfaces/logger.interface';
import { AuthController } from './controllers/auth.controller';
import { PageController } from './controllers/page.controller';
import { ExceptionFilter } from './exceptions/exception-filter';
import { TYPES } from './types';
import { IConfig } from './interfaces/config.interface';
import { Database } from './database';
import { AuthMiddleware } from './middlewares/auth.middleware';

@injectable()
export class Application {
	private app: Express;
	private server: Server;
	private port: number | string;

	constructor(
		@inject(TYPES.Config) private config: IConfig,
		@inject(TYPES.Logger) private logger: ILogger,
		@inject(TYPES.Database) private database: Database,
		@inject(TYPES.AuthController) private authController: AuthController,
		@inject(TYPES.PageController) private pageController: PageController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilter,
	) {
		this.app = express();
		this.port = this.config.get('PORT');
	}

	private initializeMiddlewares(): void {
		const authMiddleware = new AuthMiddleware(this.config.get('JWT_SECRET'));

		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	private initializeRoutes(): void {
		this.app.use(this.authController.router);
		this.app.use(this.pageController.router);
	}

	private initializeExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async start(): Promise<void> {
		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeExceptionFilters();

		await this.database.connect();
		this.server = this.app.listen(this.port, () => {
			this.logger.info(`🚀 Application is running on the port: ${this.port}`);
		});
	}

	public shutdown(): void {
		this.server.close();
	}
}
