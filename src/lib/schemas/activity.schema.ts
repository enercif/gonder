import { ACTIVITY_TYPES } from '$lib/const/activity-types';
import { z } from 'zod';

export const activitySchema = z.object({
	id: z.string().min(1),
	packageId: z.string().min(1),
	type: z.enum(ACTIVITY_TYPES),
	detail: z.string().nullable(),
	createdAt: z.string().min(1)
});

export type Activity = z.infer<typeof activitySchema>;
