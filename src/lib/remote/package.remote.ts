import { command, getRequestEvent, query } from '$app/server';
import { packageCreateSchema, packageSchema } from '$lib/schemas/package.schema';
import { db } from '$lib/server/db';
import { packageTable } from '$lib/server/db/schema';
import { getLocalTimeZone, now } from '@internationalized/date';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const getMyPackages = query(async () => {
	const event = getRequestEvent();
	if (!event.locals.user) {
		error(401, 'User not authenticated');
	}

	const packages = await db.query.packageTable.findMany({
		where: eq(packageTable.userId, event.locals.user.id)
	});

	return packageSchema.array().parse(packages);
});

export const createPackage = command(packageCreateSchema, async (input) => {
	const event = getRequestEvent();
	if (!event.locals.user) {
		error(401, 'User not authenticated');
	}

	const url = `${event.url.origin}/s/${input.id}`;

	const [newPackage] = await db
		.insert(packageTable)
		.values({
			...input,
			url,
			userId: event.locals.user.id,
			status: 'active',
			createdAt: now(getLocalTimeZone()).toAbsoluteString()
		})
		.returning();

	await getMyPackages().refresh();

	return packageSchema.parse(newPackage);
});
