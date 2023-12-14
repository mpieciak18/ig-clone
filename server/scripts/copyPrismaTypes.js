import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverPath = path.join(__dirname, '../../server');
const sharedTypesPath = path.join(__dirname, '../../shared/types');

async function copyDirectory(source, destination) {
	await fs.mkdir(destination, { recursive: true });
	const entries = await fs.readdir(source, { withFileTypes: true });

	for (const entry of entries) {
		const srcPath = path.join(source, entry.name);
		const destPath = path.join(destination, entry.name);

		entry.isDirectory()
			? await copyDirectory(srcPath, destPath)
			: await fs.copyFile(srcPath, destPath);
	}
}

async function copyPrismaTypes() {
	try {
		// Copy node_modules/@prisma
		const prismaAtClientSource = path.join(
			serverPath,
			'node_modules/@prisma'
		);
		const prismaAtClientDest = path.join(sharedTypesPath, '@prisma');
		await copyDirectory(prismaAtClientSource, prismaAtClientDest);

		// Copy node_modules/.prisma
		const prismaDotClientSource = path.join(
			serverPath,
			'node_modules/.prisma'
		);
		const prismaDotClientDest = path.join(sharedTypesPath, '.prisma');
		await copyDirectory(prismaDotClientSource, prismaDotClientDest);

		// Update import statement in .prisma/client/index.d.ts
		const indexFilePath1 = path.join(
			prismaDotClientDest,
			'client/index.d.ts'
		);
		let content1 = await fs.readFile(indexFilePath1, 'utf8');
		content1 = content1.replace(
			/@prisma\/client\/runtime\/library/g,
			'../../@prisma/client/runtime/library'
		);
		await fs.writeFile(indexFilePath1, content1);

		// Update import statement in @prisma/client/index.d.ts
		const indexFilePath2 = path.join(
			prismaAtClientDest,
			'client/index.d.ts'
		);
		let content2 = await fs.readFile(indexFilePath2, 'utf8');
		content2 = content2.replace(/.prisma\/client/g, '../../.prisma/client');
		await fs.writeFile(indexFilePath2, content2);

		console.log('Prisma types copied and modified successfully!');
	} catch (error) {
		console.error('Error copying Prisma types:', error);
	}
}

copyPrismaTypes();
