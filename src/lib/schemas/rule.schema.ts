import { z } from 'zod';

const baseRuleSchema = z.object({
	enabled: z.boolean()
});

const maxDownloadRule = baseRuleSchema
	.extend({
		id: z.literal('max_download'),
		limit: z.number()
	})
	.refine((rule) => !rule.enabled || rule.limit >= 1, {
		message: 'Download limit must be at least 1',
		path: ['limit']
	});

const expirationRule = baseRuleSchema
	.extend({
		id: z.literal('expiration'),
		expiresAt: z.string()
	})
	.refine((rule) => !rule.enabled || rule.expiresAt.length >= 1, {
		message: 'An expiration date is required',
		path: ['expiresAt']
	});

const passwordRule = baseRuleSchema
	.extend({
		id: z.literal('password'),
		password: z.string()
	})
	.refine((rule) => !rule.enabled || rule.password.length >= 1, {
		message: 'A password is required',
		path: ['password']
	});

const maxFileSizeRule = baseRuleSchema
	.extend({
		id: z.literal('max_file_size'),
		bytes: z.number()
	})
	.refine((rule) => !rule.enabled || rule.bytes >= 1, {
		message: 'Max file size must be at least 1 byte',
		path: ['bytes']
	});

const maxPackageSizeRule = baseRuleSchema
	.extend({
		id: z.literal('max_package_size'),
		bytes: z.number()
	})
	.refine((rule) => !rule.enabled || rule.bytes >= 1, {
		message: 'Max package size must be at least 1 byte',
		path: ['bytes']
	});

const maxFileCountRule = baseRuleSchema
	.extend({
		id: z.literal('max_file_count'),
		limit: z.number()
	})
	.refine((rule) => !rule.enabled || rule.limit >= 1, {
		message: 'Max file count must be at least 1',
		path: ['limit']
	});

const allowedFileTypesRule = baseRuleSchema
	.extend({
		id: z.literal('allowed_file_types'),
		types: z.array(z.string().min(1)).default([])
	})
	.refine((rule) => !rule.enabled || rule.types.length >= 1, {
		message: 'Select at least one allowed file type',
		path: ['types']
	});

const notificationRule = baseRuleSchema
	.extend({
		id: z.literal('notification'),
		channels: z.array(z.enum(['email', 'ntfy', 'telegram'])).default([])
	})
	.refine((rule) => !rule.enabled || rule.channels.length >= 1, {
		message: 'Select at least one notification channel',
		path: ['channels']
	});

const automaticPurgeRule = baseRuleSchema.extend({
	id: z.literal('automatic_purge')
});

const requireCredentialsRule = baseRuleSchema.extend({
	id: z.literal('require_credentials')
});

export const ruleSchema = z.discriminatedUnion('id', [
	maxDownloadRule,
	expirationRule,
	passwordRule,
	maxFileSizeRule,
	maxPackageSizeRule,
	maxFileCountRule,
	allowedFileTypesRule,
	notificationRule,
	automaticPurgeRule,
	requireCredentialsRule
]);

export type Rule = z.infer<typeof ruleSchema>;
