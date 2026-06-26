import type { Rule } from '$lib/schemas/rule.schema';

/** Human-readable title + short description for each rule, keyed by its `id`. */
export const ruleMeta: Record<Rule['id'], { title: string; description: string }> = {
	max_download: {
		title: 'Download Limit',
		description: 'Limits how many times the package can be downloaded.'
	},
	max_file_count: {
		title: 'Max File Count',
		description: 'Caps the number of files the package may contain.'
	},
	expiration: {
		title: 'Expiration Date',
		description: 'The package becomes unavailable after this date.'
	},
	password: {
		title: 'Password Protection',
		description: 'Recipients must enter a password to access the package.'
	},
	max_file_size: {
		title: 'Max File Size',
		description: 'Sets the largest size allowed for a single file.'
	},
	max_package_size: {
		title: 'Max Package Size',
		description: 'Sets the largest total size for the whole package.'
	},
	allowed_file_types: {
		title: 'Allowed File Types',
		description: 'Only the selected file types can be uploaded.'
	},
	notification: {
		title: 'Notifications',
		description: 'Get notified about activity on this package.'
	},
	automatic_purge: {
		title: 'Automatic Purge',
		description: 'Files are permanently deleted once the package expires.'
	},
	require_credentials: {
		title: 'Require Credentials',
		description: 'Recipients must identify themselves before accessing.'
	}
};
