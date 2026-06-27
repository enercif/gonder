import { command, getRequestEvent, query } from '$app/server';
import { PACKAGE_TYPES } from '$lib/const/package-types';
import { packageCreateSchema, packageSchema } from '$lib/schemas/package.schema';
import { db } from '$lib/server/db';
import { packageTable } from '$lib/server/db/schema';
import { getLocalTimeZone, now } from '@internationalized/date';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

export const getMyPackages = query(async () => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'User not authenticated');
	}

	const packages = await db.query.packageTable.findMany({
		where: eq(packageTable.userId, user.id)
	});

	return packageSchema.array().parse(packages);
});

export const getMyPackageById = query(z.string(), async (id) => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'User not authenticated');
	}

	const packageData = await db.query.packageTable.findFirst({
		where: (pkg) => and(eq(pkg.id, id), eq(pkg.userId, user.id))
	});

	if (!packageData) {
		error(404, 'Package not found');
	}

	return packageSchema.parse(packageData);
});

export const getPackageByIdAndType = query(
	z.object({ id: z.string(), type: z.enum(PACKAGE_TYPES) }),
	async (input) => {
		const packageData = await db.query.packageTable.findFirst({
			where: (pkg) => and(eq(pkg.id, input.id), eq(pkg.type, input.type))
		});

		if (!packageData) {
			error(404, 'Package not found');
		}

		return packageSchema.parse(packageData);
	}
);

export const createPackage = command(packageCreateSchema, async (input) => {
	const event = getRequestEvent();
	const user = event.locals.user;

	if (!user) {
		error(401, 'User not authenticated');
	}

	const url = `${event.url.origin}/s/${input.id}`;

	const [newPackage] = await db
		.insert(packageTable)
		.values({
			...input,
			url,
			userId: user.id,
			status: 'active',
			createdAt: now(getLocalTimeZone()).toAbsoluteString()
		})
		.returning();

	await getMyPackages().refresh();

	return packageSchema.parse(newPackage);
});
