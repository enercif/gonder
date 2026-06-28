<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import TimeField from '$lib/components/ui/time-field/time-field.svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import {
		getLocalTimeZone,
		parseZonedDateTime,
		toCalendarDate,
		toCalendarDateTime,
		toTime,
		toZoned,
		today,
		type CalendarDate,
		type Time
	} from '@internationalized/date';
	import { CalendarIcon } from '@lucide/svelte';
	import { watch } from 'runed';

	interface Props {
		value: string;
	}

	let { value = $bindable() }: Props = $props();

	const locale = getLocale();
	let open = $state(false);

	let dateValue = $state<CalendarDate | undefined>(toCalendarDate(parseZonedDateTime(value)));
	let timeValue = $state<Time | undefined>(toTime(parseZonedDateTime(value)));

	watch([() => dateValue, () => timeValue], ([date, time]) => {
		if (!(date && time)) return;
		const zoned = toZoned(toCalendarDateTime(date, time), getLocalTimeZone());
		value = zoned.toString();
	});
</script>

<InputGroup.Root class="w-fit">
	<InputGroup.Addon align="inline-start" class="text-foreground">
		<Popover.Root bind:open>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="ghost" class="justify-between pl-0 font-normal">
						<CalendarIcon />
						{dateValue
							? dateValue.toDate(getLocalTimeZone()).toLocaleDateString(locale)
							: 'Select date'}
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto overflow-hidden p-0" align="start">
				<Calendar
					type="single"
					bind:value={dateValue}
					{locale}
					captionLayout="dropdown"
					onValueChange={() => (open = false)}
					minValue={today(getLocalTimeZone())}
				/>
			</Popover.Content>
		</Popover.Root>
	</InputGroup.Addon>
	<InputGroup.Addon align="inline-end" class="text-foreground">
		<TimeField {locale} bind:value={timeValue} />
	</InputGroup.Addon>
</InputGroup.Root>
