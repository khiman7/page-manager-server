import { IsString, MinLength } from 'class-validator';

export class PageDTO {
	@IsString()
	@MinLength(3)
	title: string;

	@IsString()
	@MinLength(16)
	description: string;

	@IsString()
	@MinLength(12)
	content: string;

	@IsString()
	@MinLength(3)
	slug: string;
}
