import type { Rule } from '$lib/schemas/rule.schema';
import {
	BellIcon,
	ClockIcon,
	DownloadIcon,
	FileCheckIcon,
	FileScanIcon,
	FileStackIcon,
	FlameIcon,
	HardDriveIcon,
	LockIcon,
	UserIcon,
	type LucideIcon
} from '@lucide/svelte';

export const ruleMeta: Record<
	Rule['id'],
	{ title: string; description: string; icon: LucideIcon }
> = {
	max_download: {
		title: 'Download Limit',
		description: 'Limits how many times the package can be downloaded.',
		icon: DownloadIcon
	},
	max_file_count: {
		title: 'Max File Count',
		description: 'Caps the number of files the package may contain.',
		icon: FileStackIcon
	},
	expiration: {
		title: 'Expiration Date',
		description: 'The package becomes unavailable after this date.',
		icon: ClockIcon
	},
	password: {
		title: 'Password Protection',
		description: 'Recipients must enter a password to access the package.',
		icon: LockIcon
	},
	max_file_size: {
		title: 'Max File Size',
		description: 'Sets the largest size allowed for a single file.',
		icon: FileScanIcon
	},
	max_package_size: {
		title: 'Max Package Size',
		description: 'Sets the largest total size for the whole package.',
		icon: HardDriveIcon
	},
	allowed_file_types: {
		title: 'Allowed File Types',
		description: 'Only the selected file types can be uploaded.',
		icon: FileCheckIcon
	},
	notification: {
		title: 'Notifications',
		description: 'Get notified about activity on this package.',
		icon: BellIcon
	},
	automatic_purge: {
		title: 'Automatic Purge',
		description: 'Files are permanently deleted once the package expires.',
		icon: FlameIcon
	},
	require_credentials: {
		title: 'Require Credentials',
		description: 'Recipients must identify themselves before accessing.',
		icon: UserIcon
	}
};
