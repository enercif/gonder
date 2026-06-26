<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { getLocalTimeZone, today, type CalendarDate } from '@internationalized/date';
	import { CalendarIcon } from '@lucide/svelte';

	const id = $props.id();

	let open = $state(false);
	let value = $state<CalendarDate | undefined>();

	let locale = getLocale();
</script>

<Popover.Root bind:open>
	<Popover.Trigger id="{id}-date">
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="justify-between font-normal">
				<CalendarIcon />
				{value ? value.toDate(getLocalTimeZone()).toLocaleDateString(locale) : 'Select date'}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto overflow-hidden p-0" align="start">
		<Calendar
			type="single"
			bind:value
			{locale}
			captionLayout="dropdown"
			onValueChange={() => {
				open = false;
			}}
			minValue={today(getLocalTimeZone())}
		/>
	</Popover.Content>
</Popover.Root>
