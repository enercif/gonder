<script lang="ts">
	import type { Rule } from '$lib/schemas/rule.schema';
	import { getLocalTimeZone, now, parseZonedDateTime } from '@internationalized/date';
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
		UserIcon
	} from '@lucide/svelte';

	interface Props {
		rules: Rule[];
	}

	let { rules }: Props = $props();

	function bytesToSize(bytes: number): string {
		if (bytes < 1024) return bytes + 'B';
		else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + 'KB';
		else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
		else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
	}
</script>

<div class="flex flex-row flex-wrap items-center gap-2">
	{#each rules as rule (rule.id)}
		{#if rule.enabled}
			<div
				class="flex flex-row items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
			>
				{#if rule.id === 'allowed_file_types'}
					<FileCheckIcon class="size-3" />
					<span> {rule.types.slice(0, 2).join(', ')}{rule.types.length > 2 ? ', ...' : ''} </span>
				{:else if rule.id === 'automatic_purge'}
					<FlameIcon class="size-4" />
				{:else if rule.id === 'expiration'}
					<ClockIcon class="size-3" />
					<span>
						{Math.round(
							parseZonedDateTime(rule.expiresAt).compare(now(getLocalTimeZone())) /
								1000 /
								60 /
								60 /
								24
						)}d</span
					>
				{:else if rule.id === 'max_download'}
					<DownloadIcon class="size-3" />
					<span> /{rule.limit} </span>
				{:else if rule.id === 'max_file_count'}
					<FileStackIcon class="size-3" />
					<span> /{rule.limit} </span>
				{:else if rule.id === 'max_file_size'}
					<FileScanIcon class="size-3" />
					<span> {bytesToSize(rule.bytes)} </span>
				{:else if rule.id === 'max_package_size'}
					<HardDriveIcon class="size-3" />
					<span> {bytesToSize(rule.bytes)} </span>
				{:else if rule.id === 'notification'}
					<BellIcon class="size-4" />
				{:else if rule.id === 'password'}
					<LockIcon class="size-4" />
				{:else if rule.id === 'require_credentials'}
					<UserIcon class="size-4" />
				{/if}
			</div>
		{/if}
	{/each}
</div>
