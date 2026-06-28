export const ACTIVITY_TYPES = [
	'created',
	'viewed',
	'downloaded',
	'uploaded',
	'deleted',
	'updated',
	'expired'
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];
