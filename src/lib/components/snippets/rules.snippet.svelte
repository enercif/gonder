<script module>
	import { ruleMeta } from '$lib/meta/rule-meta';
	import { formatBytes } from '$lib/utils';
	import { getLocalTimeZone, now, parseZonedDateTime } from '@internationalized/date';
	import { CircleOffIcon } from '@lucide/svelte';

	export { rulesSnippet };
</script>

<script lang="ts">
	import type { Rule } from '$lib/schemas/rule.schema';
</script>

{#snippet rulesSnippet(rules: Rule[])}
	{@const enabledRules = Object.values(rules).filter((rule) => rule.enabled)}
	<div class="flex flex-row flex-wrap items-center gap-2">
		{#if enabledRules.length === 0}
			<div
				class="flex flex-row items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
			>
				<CircleOffIcon class="size-4" />
			</div>
		{/if}

		{#each enabledRules as rule (rule.id)}
			{@const Icon = ruleMeta[rule.id].icon}
			<div
				class="flex flex-row items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
			>
				{#if rule.id === 'allowed_file_types'}
					<Icon class="size-3" />
					<span> {rule.types.slice(0, 2).join(', ')}{rule.types.length > 2 ? ', ...' : ''} </span>
				{:else if rule.id === 'automatic_purge'}
					<Icon class="size-4" />
				{:else if rule.id === 'expiration'}
					<Icon class="size-3" />
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
					<Icon class="size-3" />
					<span> /{rule.limit} </span>
				{:else if rule.id === 'max_file_count'}
					<Icon class="size-3" />
					<span> /{rule.limit} </span>
				{:else if rule.id === 'max_file_size'}
					<Icon class="size-3" />
					<span> {formatBytes(rule.bytes)} </span>
				{:else if rule.id === 'max_package_size'}
					<Icon class="size-3" />
					<span> {formatBytes(rule.bytes)} </span>
				{:else if rule.id === 'notification'}
					<Icon class="size-4" />
				{:else if rule.id === 'password'}
					<Icon class="size-4" />
				{:else if rule.id === 'require_credentials'}
					<Icon class="size-4" />
				{/if}
			</div>
		{/each}
	</div>
{/snippet}
