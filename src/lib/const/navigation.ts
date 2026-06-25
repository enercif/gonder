import { type LucideIcon } from '@lucide/svelte';
import ActivityIcon from '@lucide/svelte/icons/activity';
import HardDriveIcon from '@lucide/svelte/icons/hard-drive';
import PackageIcon from '@lucide/svelte/icons/package';
import SettingsIcon from '@lucide/svelte/icons/settings';
import UsersIcon from '@lucide/svelte/icons/users';

export type NavigationItem = {
	label: string;
	href: string;
	icon: LucideIcon;
};

export type NavigationGroup = {
	label: string;
	items: NavigationItem[];
	path: string;
};

export const navigation: NavigationGroup[] = [
	{
		label: 'Platform',
		path: '/platform',
		items: [
			{
				label: 'Packages',
				href: '/packages',
				icon: PackageIcon
			},
			{
				label: 'Activity',
				href: '/activity',
				icon: ActivityIcon
			},
			{
				label: 'Storage',
				href: '/storage',
				icon: HardDriveIcon
			}
		]
	},
	{
		label: 'Admin',
		path: '/admin',
		items: [
			{
				label: 'Users',
				href: '/users',
				icon: UsersIcon
			},
			{
				label: 'Settings',
				href: '/settings',
				icon: SettingsIcon
			},
			{
				label: 'Storage',
				href: '/storage',
				icon: HardDriveIcon
			}
		]
	}
];
