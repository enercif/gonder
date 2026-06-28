import { command, getRequestEvent, query } from '$app/server';
import { fileCreateSchema, fileSchema } from '$lib/schemas/file.schema';
import { db } from '$lib/server/db';
import { fileTable, packageTable } from '$lib/server/db/schema';
import { logActivity } from '$lib/server/server-utils';
import { getLocalTimeZone, now } from '@internationalized/date';
import { error } from '@sveltejs/kit';
import { and, asc, eq, getTableColumns } from 'drizzle-orm';
import z from 'zod';
import { getPackageActivity } from './activity.remote';

async function assertOwnedPackage(packageId: string) {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'User not authenticated');
	}

	const pack = await db.query.packageTable.findFirst({
		where: and(eq(packageTable.id, packageId), eq(packageTable.userId, user.id))
	});

	if (!pack) {
		error(404, 'Package not found');
	}

	return pack;
}

export const getMyFiles = query(async () => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'User not authenticated');
	}

	const files = await db
		.select(getTableColumns(fileTable))
		.from(fileTable)
		.innerJoin(packageTable, eq(fileTable.packageId, packageTable.id))
		.where(eq(packageTable.userId, user.id))
		.orderBy(asc(fileTable.createdAt));

	return fileSchema.array().parse(files);
});

export const getPackageFiles = query(z.string(), async (packageId) => {
	await assertOwnedPackage(packageId);

	const files = await db.query.fileTable.findMany({
		where: eq(fileTable.packageId, packageId),
		orderBy: asc(fileTable.createdAt)
	});

	return fileSchema.array().parse(files);
});

export const addPackageFiles = command(fileCreateSchema, async (input) => {
	await assertOwnedPackage(input.packageId);

	const createdAt = now(getLocalTimeZone()).toString();

	await db.insert(fileTable).values(
		input.files.map((file) => ({
			id: crypto.randomUUID(),
			packageId: input.packageId,
			name: file.name,
			size: file.size,
			mimeType: file.mimeType,
			createdAt
		}))
	);

	const detail =
		input.files.length === 1 ? `Added ${input.files[0].name}` : `Added ${input.files.length} files`;
	await logActivity(input.packageId, 'uploaded', detail);

	await getPackageFiles(input.packageId).refresh();
	await getPackageActivity(input.packageId).refresh();
});

export const deletePackageFile = command(
	z.object({ packageId: z.string(), fileId: z.string() }),
	async ({ packageId, fileId }) => {
		await assertOwnedPackage(packageId);

		const [deleted] = await db
			.delete(fileTable)
			.where(and(eq(fileTable.id, fileId), eq(fileTable.packageId, packageId)))
			.returning();

		if (!deleted) {
			error(404, 'File not found');
		}

		await logActivity(packageId, 'deleted', `Removed ${deleted.name}`);

		await getPackageFiles(packageId).refresh();
		await getPackageActivity(packageId).refresh();
	}
);
