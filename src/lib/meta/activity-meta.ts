import type { ActivityType } from '$lib/const/activity-types';
import {
	BanIcon,
	DownloadIcon,
	EyeIcon,
	PencilIcon,
	PlusIcon,
	Trash2Icon,
	UploadIcon,
	type LucideIcon
} from '@lucide/svelte';

export const activityMeta: Record<
	ActivityType,
	{ label: string; icon: LucideIcon; colours: string }
> = {
	created: {
		label: 'Package created',
		icon: PlusIcon,
		colours: 'text-green-600 dark:text-green-400'
	},
	viewed: { label: 'Package viewed', icon: EyeIcon, colours: 'text-blue-600 dark:text-blue-400' },
	downloaded: {
		label: 'Package downloaded',
		icon: DownloadIcon,
		colours: 'text-blue-600 dark:text-blue-400'
	},
	uploaded: {
		label: 'Files uploaded',
		icon: UploadIcon,
		colours: 'text-purple-600 dark:text-purple-400'
	},
	deleted: { label: 'File deleted', icon: Trash2Icon, colours: 'text-red-600 dark:text-red-400' },
	updated: {
		label: 'Package updated',
		icon: PencilIcon,
		colours: 'text-orange-600 dark:text-orange-400'
	},
	expired: { label: 'Package expired', icon: BanIcon, colours: 'text-gray-600 dark:text-gray-400' }
};
