import { inject, injectable } from 'inversify';

import { PageDTO } from '../dtos/page.dto';
import { Page } from '@prisma/client';
import { Page as PageEntity } from '../entities/page.entity';
import { PageRepository } from '../repositories/page.repository';
import { TYPES } from '../types';

@injectable()
export class PageService {
	constructor(@inject(TYPES.PageRepository) private pageRepository: PageRepository) {}

	async getAll(): Promise<Page[] | null> {
		return this.pageRepository.getAll();
	}

	async getBySlug(slug: string): Promise<Page | null> {
		return this.pageRepository.getBySlug(slug);
	}

	async create({ title, description, content, slug }: PageDTO): Promise<Page | null> {
		return this.pageRepository.create(new PageEntity(title, description, content, slug));
	}

	async deleteBySlug(slug: string): Promise<Page | null> {
		return this.pageRepository.deleteBySlug(slug);
	}
}
