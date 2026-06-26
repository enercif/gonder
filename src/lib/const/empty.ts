import type { PackageCreate } from '$lib/schemas/package.schema';
import type { Rule } from '$lib/schemas/rule.schema';
import { getLocalTimeZone, now } from '@internationalized/date';

const emptyMaxDownloadRule: Rule = {
	id: 'max_download',
	limit: 10,
	enabled: false
};

const emptyExpirationRule: Rule = {
	id: 'expiration',
	expiresAt: now(getLocalTimeZone()).add({ days: 7 }).toString(),
	enabled: false
};

const emptyPasswordRule: Rule = {
	id: 'password',
	password: '',
	enabled: false
};

const emptyMaxFileSizeRule: Rule = {
	id: 'max_file_size',
	bytes: 50,
	enabled: false
};

const emptyMaxPackageSizeRule: Rule = {
	id: 'max_package_size',
	bytes: 100,
	enabled: false
};

const emptyMaxFileCountRule: Rule = {
	id: 'max_file_count',
	limit: 10,
	enabled: false
};

const emptyAllowedFileTypesRule: Rule = {
	id: 'allowed_file_types',
	types: [],
	enabled: false
};

const emptyNotificationRule: Rule = {
	id: 'notification',
	channels: [],
	enabled: false
};

const emptyAutomaticPurgeRule: Rule = {
	id: 'automatic_purge',
	enabled: false
};

const emptyRequireCredentialsRule: Rule = {
	id: 'require_credentials',
	enabled: false
};

const emptyRules: Rule[] = [
	emptyMaxDownloadRule,
	emptyExpirationRule,
	emptyPasswordRule,
	emptyMaxFileSizeRule,
	emptyMaxPackageSizeRule,
	emptyMaxFileCountRule,
	emptyAllowedFileTypesRule,
	emptyNotificationRule,
	emptyAutomaticPurgeRule,
	emptyRequireCredentialsRule
];

export const emptyPackageCreate: PackageCreate = {
	name: '',
	url: '',
	description: '',
	type: 'send',
	rules: emptyRules
};

export const ruleIndexMap: Record<(typeof emptyRules)[number]['id'], number> = {
	max_download: 0,
	expiration: 1,
	password: 2,
	max_file_size: 3,
	max_package_size: 4,
	max_file_count: 5,
	allowed_file_types: 6,
	notification: 7,
	automatic_purge: 8,
	require_credentials: 9
};
