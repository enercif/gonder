<script lang="ts" module>
	import type { Time } from '@internationalized/date';
	import type { TimeValue } from 'bits-ui';

	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	import { TimeField, type WithoutChildrenOrChild } from 'bits-ui';

	let {
		value = $bindable(),
		placeholder = $bindable(),
		...restProps
	}: WithoutChildrenOrChild<TimeField.RootProps<T>> = $props();
</script>

<TimeField.Root bind:value bind:placeholder {...restProps}>
	<TimeField.Input class="text-nowrap">
		{#snippet children({ segments })}
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each segments as { part, value }}
				<TimeField.Segment {part}>
					{value}
				</TimeField.Segment>
			{/each}
		{/snippet}
	</TimeField.Input>
</TimeField.Root>
