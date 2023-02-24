import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { PageDTO } from '../dtos/page.dto';
import { HTTPException } from '../exceptions/http-exception';

import { ILogger } from '../interfaces/logger.interface';
import { GuardMiddleware } from '../middlewares/guard.middleware';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { PageService } from '../services/page.service';
import { TYPES } from '../types';
import { Controller } from './base.controller';

@injectable()
export class PageController extends Controller {
	constructor(
		@inject(TYPES.Logger) logger: ILogger,
		@inject(TYPES.PageService) private pageService: PageService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/pages/:slug',
				method: 'get',
				handler: this.get,
			},
			{
				path: '/pages',
				method: 'get',
				handler: this.getAll,
			},
			{
				path: '/pages',
				method: 'post',
				middlewares: [new GuardMiddleware(), new ValidateMiddleware(PageDTO)],
				handler: this.create,
			},
			{
				path: '/pages/:slug',
				method: 'delete',
				middlewares: [new GuardMiddleware()],
				handler: this.delete,
			},
		]);
	}

	async get(
		request: Request<Pick<PageDTO, 'slug'>>,
		response: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { slug } = request.params;
			const page = await this.pageService.getBySlug(slug);

			if (!page) {
				return next(new HTTPException(400, 'Page doesnt exist', 'page/get'));
			}

			response.send({ message: 'ok', data: page });
		} catch (error) {
			next(error);
		}
	}

	async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
		try {
			const pages = await this.pageService.getAll();

			response.send({ message: 'ok', data: pages });
		} catch (error) {
			next(error);
		}
	}

	async create(
		request: Request<{}, {}, PageDTO>,
		response: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const page = await this.pageService.getBySlug(request.body.slug);

			if (page) {
				return next(new HTTPException(400, 'Page already exists', 'page/create'));
			}

			const newPage = await this.pageService.create(request.body);

			if (!newPage) {
				return next(new HTTPException(400, 'Page not created', 'page/create'));
			}

			response.status(201).send({ message: 'created', data: newPage });
		} catch (error) {
			next(error);
		}
	}

	async delete(
		request: Request<Pick<PageDTO, 'slug'>>,
		response: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { slug } = request.params;
			const page = await this.pageService.deleteBySlug(slug);

			if (!page) {
				return next(new HTTPException(400, 'Page not deleted', 'page/delete'));
			}

			response.sendStatus(204);
		} catch (error) {
			next(error);
		}
	}
}
