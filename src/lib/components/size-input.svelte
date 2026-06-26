<script lang="ts" module>
	export const FORMATS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
	export type SizeFormat = (typeof FORMATS)[number];
</script>

<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { watch } from 'runed';

	interface Props {
		bytes?: number;
		label?: string;
	}

	// eslint-disable-next-line no-useless-assignment
	let { bytes = $bindable(0), label }: Props = $props();

	let amount = $state(50);
	let format = $state<SizeFormat>('MB');

	watch([() => amount, () => format], ([amount, format]) => {
		bytes = amount * 1000 ** FORMATS.indexOf(format);
	});
</script>

<InputGroup.Root class="w-fit">
	<InputGroup.Input
		type="number"
		min="0"
		class="w-20 grow"
		aria-label={label}
		bind:value={amount}
	/>
	<InputGroup.Addon align="inline-end" class="text-primary-foreground">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<InputGroup.Button {...props} variant="ghost">{format}</InputGroup.Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each FORMATS as f (f)}
					<DropdownMenu.Item onclick={() => (format = f)}>{f}</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</InputGroup.Addon>
</InputGroup.Root>
