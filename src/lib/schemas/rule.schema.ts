import { z } from 'zod';

const baseRuleSchema = z.object({
	enabled: z.boolean()
});

const maxDownloadRule = baseRuleSchema.extend({
	id: z.literal('max_download'),
	limit: z.number().min(1)
});

const expirationRule = baseRuleSchema.extend({
	id: z.literal('expiration'),
	expiresAt: z.string().min(1)
});

const passwordRule = baseRuleSchema.extend({
	id: z.literal('password'),
	password: z.string()
});

const maxFileSizeRule = baseRuleSchema.extend({
	id: z.literal('max_file_size'),
	bytes: z.number().min(1)
});

const maxPackageSizeRule = baseRuleSchema.extend({
	id: z.literal('max_package_size'),
	bytes: z.number().min(1)
});

const maxFileCountRule = baseRuleSchema.extend({
	id: z.literal('max_file_count'),
	limit: z.number().min(1)
});

const allowedFileTypesRule = baseRuleSchema.extend({
	id: z.literal('allowed_file_types'),
	types: z.array(z.string().min(1))
});

const notificationRule = baseRuleSchema.extend({
	id: z.literal('notification'),
	channels: z.array(z.enum(['email', 'ntfy', 'telegram']))
});

const automaticPurgeRule = baseRuleSchema.extend({
	id: z.literal('automatic_purge')
});

// New rule -> Require Credentials (Email)

const requireCredentialsRule = baseRuleSchema.extend({
	id: z.literal('require_credentials')
});

export const ruleSchema = z.union([
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
