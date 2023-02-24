import { Application } from './app';
import { container } from './configs/inversify.config';
import { TYPES } from './types';

async function main(): Promise<void> {
	const app = container.get<Application>(TYPES.Application);

	await app.start();
}

main();
