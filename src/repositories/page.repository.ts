import { inject, injectable } from 'inversify';
import { Page } from '@prisma/client';
import { Page as PageEntity } from '../entities/page.entity';

import { Database } from '../database';
import { TYPES } from '../types';

@injectable()
export class PageRepository {
	constructor(@inject(TYPES.Database) private database: Database) {}

	async getAll(): Promise<Page[] | null> {
		return this.database.client.page.findMany();
	}

	async getBySlug(slug: string): Promise<Page | null> {
		return this.database.client.page.findUnique({
			where: { slug },
		});
	}

	async create({ title, description, content, slug }: PageEntity): Promise<Page | null> {
		return this.database.client.page.create({
			data: {
				title,
				description,
				content,
				slug,
			},
		});
	}

	async deleteBySlug(slug: string): Promise<Page | null> {
		return this.database.client.page.delete({
			where: {
				slug,
			},
		});
	}
}
