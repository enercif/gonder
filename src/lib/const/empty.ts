import type { Rule } from '$lib/schemas/rule.schema';
import { getLocalTimeZone, now } from '@internationalized/date';

export type RuleMap = { [R in Rule as R['id']]: R };

export function createEmptyRules(): RuleMap {
	return {
		max_download: { id: 'max_download', limit: 10, enabled: false },
		expiration: {
			id: 'expiration',
			expiresAt: now(getLocalTimeZone()).add({ days: 7 }).toString(),
			enabled: false
		},
		password: { id: 'password', password: '', enabled: false },
		max_file_size: { id: 'max_file_size', bytes: 50_000_000, enabled: false },
		max_package_size: { id: 'max_package_size', bytes: 50_000_000, enabled: false },
		max_file_count: { id: 'max_file_count', limit: 10, enabled: false },
		allowed_file_types: { id: 'allowed_file_types', types: [], enabled: false },
		notification: { id: 'notification', channels: [], enabled: false },
		automatic_purge: { id: 'automatic_purge', enabled: false },
		require_credentials: { id: 'require_credentials', enabled: false }
	};
}
