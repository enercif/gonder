import type { ActivityType } from '$lib/const/activity-types';
import { db } from '$lib/server/db';
import { activityTable } from '$lib/server/db/schema';
import { getLocalTimeZone, now } from '@internationalized/date';

export async function logActivity(packageId: string, type: ActivityType, detail?: string) {
	await db.insert(activityTable).values({
		id: crypto.randomUUID(),
		packageId,
		type,
		detail: detail ?? null,
		createdAt: now(getLocalTimeZone()).toString()
	});
}
