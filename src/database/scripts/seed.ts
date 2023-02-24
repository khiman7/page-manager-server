import 'dotenv/config';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
	try {
		const username = process.env.ADMIN_USERNAME as string;
		const password = await hash(process.env.ADMIN_PASSWORD as string, 7);

		const admin = await prisma.user.create({
			data: {
				username,
				password,
			},
		});

		const test = await prisma.user.findUnique({
			where: {
				id: admin.id,
			},
		});

		console.log(test);
	} catch (error) {
		console.error('An error occured while seeding an admin', error);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
