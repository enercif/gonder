import { getRequestEvent, query } from '$app/server';
import { activitySchema } from '$lib/schemas/activity.schema';
import { db } from '$lib/server/db';
import { activityTable, packageTable } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import z from 'zod';

export const getPackageActivity = query(z.string(), async (packageId) => {
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

	const activities = await db.query.activityTable.findMany({
		where: eq(activityTable.packageId, packageId),
		orderBy: desc(activityTable.createdAt)
	});

	return activitySchema.array().parse(activities);
});
