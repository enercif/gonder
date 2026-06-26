<script module>
	export { statusBadgeSnippet };
</script>

<script lang="ts">
</script>

{#snippet statusBadgeSnippet(status: 'active' | 'expired' | 'expiring' | 'inactive')}
	<div
		class={[
			'flex w-fit flex-row items-center gap-1 text-xs',
			status === 'active' && ' text-green-600 dark:text-green-400',
			status === 'expired' && ' text-gray-600 dark:text-gray-400',
			status === 'expiring' && ' text-yellow-600 dark:text-yellow-400',
			status === 'inactive' && ' text-red-600 dark:text-red-400'
		]}
	>
		<span
			class={[
				'mr-0.5 size-1.5 rounded-full',
				status === 'active' && 'bg-green-600 dark:bg-green-400',
				status === 'expired' && 'bg-gray-600 dark:bg-gray-400',
				status === 'expiring' && 'bg-yellow-600 dark:bg-yellow-400',
				status === 'inactive' && 'bg-red-600 dark:bg-red-400'
			]}
		></span>

		{#if status === 'active'}
			Active
		{:else if status === 'expired'}
			Expired
		{:else if status === 'expiring'}
			Expiring
		{:else}
			Inactive
		{/if}
	</div>
{/snippet}
