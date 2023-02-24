import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../types';
import { Application } from '../app';
import { AuthController } from '../controllers/auth.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { PageController } from '../controllers/page.controller';
import { PageService } from '../services/page.service';
import { PageRepository } from '../repositories/page.repository';
import { ExceptionFilter } from '../exceptions/exception-filter';
import { IExceptionFilter } from '../interfaces/exception-filter.interface';
import { ILogger } from '../interfaces/logger.interface';
import { Logger } from '../utilities/logger';
import { IConfig } from '../interfaces/config.interface';
import { Config } from '.';
import { Database } from '../database';
import { IDatabase } from '../interfaces/database.interface';

const bindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
	bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
	bind<PageController>(TYPES.PageController).to(PageController).inSingletonScope();
	bind<PageService>(TYPES.PageService).to(PageService).inSingletonScope();
	bind<PageRepository>(TYPES.PageRepository).to(PageRepository).inSingletonScope();
	bind<IConfig>(TYPES.Config).to(Config).inSingletonScope();
	bind<IDatabase>(TYPES.Database).to(Database).inSingletonScope();
	bind<Application>(TYPES.Application).to(Application).inSingletonScope();
});

const container: Container = new Container();

container.load(bindings);

export { container };
