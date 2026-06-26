import { PACKAGE_STATUS } from '$lib/const/package-status';
import { PACKAGE_TYPES } from '$lib/const/package-types';
import { z } from 'zod';
import { ruleSchema } from './rule.schema';

const packageBaseSchema = z.object({
	name: z.string().min(1),
	url: z.string().min(1),
	description: z.string(),
	type: z.enum(PACKAGE_TYPES),
	rules: z.array(ruleSchema)
});

export const packageSchema = packageBaseSchema.extend({
	id: z.string().min(1),
	status: z.enum(PACKAGE_STATUS),
	createdAt: z.string().min(1)
});

export const packageCreateSchema = packageBaseSchema;

export type Package = z.infer<typeof packageSchema>;
export type PackageCreate = z.infer<typeof packageCreateSchema>;
