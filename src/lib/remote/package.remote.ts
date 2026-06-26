import { form, getRequestEvent, query } from '$app/server';
import { packageCreateSchema, packageSchema } from '$lib/schemas/package.schema';
import { db } from '$lib/server/db';
import { packageTable } from '$lib/server/db/schema';
import { getLocalTimeZone, now } from '@internationalized/date';
import { eq } from 'drizzle-orm';

export const getMyPackages = query(async () => {
	const event = getRequestEvent();
	if (!event.locals.user) {
		throw new Error('User not authenticated');
	}

	const packages = await db.query.packageTable.findMany({
		where: eq(packageTable.userId, event.locals.user.id)
	});

	return packageSchema.array().parse(packages);
});

export const createPackageForm = form(packageCreateSchema, async (packageCreate) => {
	console.log('packageCreate', packageCreate);

	const event = getRequestEvent();
	if (!event.locals.user) {
		throw new Error('User not authenticated');
	}

	const [newPackage] = await db
		.insert(packageTable)
		.values({
			...packageCreate,
			id: crypto.randomUUID(),
			userId: event.locals.user.id,
			status: 'active',
			createdAt: now(getLocalTimeZone()).toAbsoluteString()
		})
		.returning();

	return packageSchema.parse(newPackage);
});
