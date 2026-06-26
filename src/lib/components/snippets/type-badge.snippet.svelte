<script module>
	export { typeBadgeSnippet };
</script>

<script lang="ts">
	import { type PackageType } from '$lib/const/package-types';

	import { SendIcon } from '@lucide/svelte';
</script>

{#snippet typeBadgeSnippet(type: PackageType)}
	<div
		class={[
			'flex w-fit flex-row items-center gap-1 text-xs',
			type === 'receive' && ' text-purple-600 dark:text-purple-400',
			type === 'send' && ' text-blue-600 dark:text-blue-400'
		]}
	>
		<SendIcon class={['size-3', type === 'receive' && 'rotate-180']} />
		{type === 'receive' ? 'Receive' : 'Send'}
	</div>
{/snippet}
