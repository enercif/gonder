<script lang="ts">
	import type { Rule } from '$lib/schemas/rule.schema';
	import { getLocalTimeZone, now, parseZonedDateTime } from '@internationalized/date';
	import {
		BellIcon,
		CircleOffIcon,
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
		const size = 1000;
		if (bytes < size) return bytes + 'B';
		else if (bytes < size * size) return (bytes / size).toFixed(0) + 'KB';
		else if (bytes < size * size * size) return (bytes / (size * size)).toFixed(0) + 'MB';
		else if (bytes < size * size * size * size)
			return (bytes / (size * size * size)).toFixed(0) + 'GB';
		return (bytes / (size * size * size * size)).toFixed(0) + 'TB';
	}

	const enabledRules = $derived(rules.filter((rule) => rule.enabled));
</script>

<div class="flex flex-row flex-wrap items-center gap-2">
	{#if enabledRules.length === 0}
		<div
			class="flex flex-row items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
		>
			<CircleOffIcon class="size-4" />
		</div>
	{/if}

	{#each enabledRules as rule (rule.id)}
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
	{/each}
</div>
