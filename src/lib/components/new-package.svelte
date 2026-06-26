<script lang="ts">
	import logo from '$lib/assets/icon.png';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { emptyPackageCreate, ruleIndexMap } from '$lib/const/empty';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import { createPackageForm } from '$lib/remote/package.remote';
	import {
		CalendarDate,
		getLocalTimeZone,
		parseZonedDateTime,
		Time,
		toCalendarDate,
		toCalendarDateTime,
		today,
		toTime,
		toZoned
	} from '@internationalized/date';
	import {
		CalendarIcon,
		CheckIcon,
		ClockIcon,
		CopyIcon,
		DownloadIcon,
		FileScanIcon,
		FileStackIcon,
		FlameIcon,
		HardDriveIcon,
		LinkIcon,
		LockIcon,
		PlusIcon,
		ShieldCheckIcon,
		UserIcon
	} from '@lucide/svelte';
	import { qr } from '@svelte-put/qr/svg';
	import { watch } from 'runed';
	import { slide } from 'svelte/transition';
	import Separator from './ui/separator/separator.svelte';
	import Switch from './ui/switch/switch.svelte';
	import Textarea from './ui/textarea/textarea.svelte';
	import TimeField from './ui/time-field/time-field.svelte';

	let open = $state(false);
	let dateValue = $state<CalendarDate | undefined>();
	let timeValue = $state<Time | undefined>();
	let locale = getLocale();
	let id = $state('');

	let maxFileSizeInput = $state('');
	let maxFileSizeFormat = $state('');

	let maxPackageSizeInput = $state('');
	let maxPackageSizeFormat = $state('');

	const FORMATS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
	const clipboard = new UseClipboard();
	const { name, rules, description, type, url } = createPackageForm.fields;

	const activeRules = $derived(rules.value().filter((rule) => rule && rule.enabled));

	function initPackage() {
		createPackageForm.fields.set(emptyPackageCreate);
		const zonedDateTime = parseZonedDateTime(rules[ruleIndexMap['expiration']].expiresAt.value()!);
		dateValue = toCalendarDate(zonedDateTime);
		timeValue = toTime(zonedDateTime);

		maxFileSizeFormat = 'MB';
		maxFileSizeInput = '50';

		maxPackageSizeFormat = 'MB';
		maxPackageSizeInput = '50';

		id = crypto.randomUUID();
		url.set(`https://gonder.io/s/${id}`);
		type.set('send');
	}

	function isRuleEnabled(ruleId: keyof typeof ruleIndexMap) {
		const index = ruleIndexMap[ruleId];
		const rule = rules.value()[index];
		return rule?.enabled ?? false;
	}

	function setRuleEnabled(ruleId: keyof typeof ruleIndexMap, enabled: boolean) {
		const index = ruleIndexMap[ruleId];
		const rule = rules.value()[index];
		if (rule) rule.enabled = enabled;
	}

	watch([() => dateValue, () => timeValue], ([newDate, newTime]) => {
		if (!(newDate && newTime)) return;
		const dateTime = toCalendarDateTime(newDate, newTime);
		const zonedDateTime = toZoned(dateTime, getLocalTimeZone());
		rules[ruleIndexMap['expiration']].expiresAt.set(zonedDateTime.toString());
	});

	watch([() => maxFileSizeInput, () => maxFileSizeFormat], ([newInput, newFormat]) => {
		if (!newInput || !newFormat) return;
		const bytes =
			parseInt(newInput) * 1000 ** FORMATS.indexOf(newFormat as (typeof FORMATS)[number]);
		rules[ruleIndexMap['max_file_size']].bytes.set(bytes);
	});

	watch([() => maxPackageSizeInput, () => maxPackageSizeFormat], ([newInput, newFormat]) => {
		if (!newInput || !newFormat) return;
		const bytes =
			parseInt(newInput) * 1000 ** FORMATS.indexOf(newFormat as (typeof FORMATS)[number]);
		rules[ruleIndexMap['max_package_size']].bytes.set(bytes);
	});
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'default' })} onclick={initPackage}>
		<PlusIcon />
		New Package
	</Sheet.Trigger>
	<Sheet.Content class=" sm:max-w-150!">
		<Sheet.Header>
			<Sheet.Title>Create a new Package</Sheet.Title>
			<Sheet.Description>Choose a direction and rules for the Package</Sheet.Description>
		</Sheet.Header>

		<form
			{...createPackageForm}
			class="flex size-full flex-col gap-4 overflow-y-scroll px-4 pb-4"
			id="create-package-form"
		>
			<input {...type.as('hidden', 'send')} />
			<input {...url.as('hidden', 'test')} />
			<Tabs.Root value="send">
				<Tabs.List class="w-full">
					<Tabs.Trigger value="send">Send</Tabs.Trigger>
					<Tabs.Trigger value="receive">Receive</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>

			{JSON.stringify(createPackageForm.fields.allIssues(), null, 2)}

			<Card.Root class="shrink-0">
				<Card.Header>
					<Card.Title>Details</Card.Title>
				</Card.Header>
				<Card.Content>
					<Field.Set>
						<Field.Group>
							<Field.Field>
								<Field.Label for="name">Package Name</Field.Label>
								<Input id="name" {...name.as('text')} />
							</Field.Field>
							<Field.Field>
								<Field.Label for="description">Description (optional)</Field.Label>
								<Textarea id="description" {...description.as('text')} />
							</Field.Field>
						</Field.Group>
					</Field.Set>
				</Card.Content>
			</Card.Root>

			<Card.Root class="shrink-0">
				<Card.Header class="flex flex-row items-center justify-between">
					<Card.Title>Rules</Card.Title>
					<span class="flex flex-row items-center gap-1 text-primary">
						<ShieldCheckIcon class="size-4" />
						{#if activeRules.length === 0}
							<span class="text-xs">No active rules</span>
						{:else}
							<span class="text-xs">{activeRules.length} active rules</span>
						{/if}
					</span>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col divide-y divide-border">
						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<DownloadIcon class="size-5 " />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Download Limit</span>

							{#if isRuleEnabled('max_download')}
								<div transition:slide={{ axis: 'x', duration: 300 }}>
									<Input
										min="1"
										max="100"
										class="w-20"
										{...rules[ruleIndexMap['max_download']].limit.as('number')}
									/>
								</div>
							{/if}
							<Switch
								value={isRuleEnabled('max_download')}
								onCheckedChange={(checked) => setRuleEnabled('max_download', checked)}
							/>
						</div>

						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<FileStackIcon class="size-5 " />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Max file count</span>

							{#if isRuleEnabled('max_file_count')}
								<div transition:slide={{ axis: 'x', duration: 300 }}>
									<Input
										min="1"
										max="100"
										class="w-20"
										{...rules[ruleIndexMap['max_file_count']].limit.as('number')}
									/>
								</div>
							{/if}
							<Switch
								value={isRuleEnabled('max_file_count')}
								onCheckedChange={(checked) => setRuleEnabled('max_file_count', checked)}
							/>
						</div>

						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<ClockIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Expiration Date</span>

							{#if isRuleEnabled('expiration')}
								<div transition:slide={{ axis: 'x', duration: 300 }}>
									<InputGroup.Root class="w-fit">
										<InputGroup.Addon align="inline-start" class="text-primary-foreground">
											<Popover.Root bind:open>
												<Popover.Trigger>
													{#snippet child({ props })}
														<Button
															{...props}
															variant="ghost"
															class="justify-between pl-0 font-normal"
														>
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
														onValueChange={() => {
															open = false;
														}}
														minValue={today(getLocalTimeZone())}
													/>
												</Popover.Content>
											</Popover.Root>
										</InputGroup.Addon>
										<InputGroup.Addon align="inline-end" class="text-primary-foreground">
											<TimeField {locale} bind:value={timeValue} />
										</InputGroup.Addon>
									</InputGroup.Root>
								</div>
							{/if}

							<Switch
								value={isRuleEnabled('expiration')}
								onCheckedChange={(checked) => setRuleEnabled('expiration', checked)}
							/>
						</div>

						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<LockIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Password protection</span
							>

							{#if isRuleEnabled('password')}
								<div transition:slide={{ axis: 'x', duration: 300 }}>
									<Input {...rules[ruleIndexMap['password']].password.as('password')} />
								</div>
							{/if}
							<Switch
								value={isRuleEnabled('password')}
								onCheckedChange={(checked) => setRuleEnabled('password', checked)}
							/>
						</div>

						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<FileScanIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Max file size</span>

							{#if isRuleEnabled('max_file_size')}
								<div transition:slide={{ axis: 'x', duration: 300 }}>
									<InputGroup.Root class="w-fit">
										<InputGroup.Input
											type="number"
											min="0"
											class="w-20 grow"
											bind:value={maxFileSizeInput}
										/>
										<InputGroup.Addon align="inline-end" class="text-primary-foreground">
											<DropdownMenu.Root>
												<DropdownMenu.Trigger>
													{#snippet child({ props })}
														<InputGroup.Button {...props} variant="ghost">
															{maxFileSizeFormat}
														</InputGroup.Button>
													{/snippet}
												</DropdownMenu.Trigger>
												<DropdownMenu.Content>
													<!-- eslint-disable-next-line svelte/require-each-key -->
													{#each FORMATS as format}
														<DropdownMenu.Item onclick={() => (maxFileSizeFormat = format)}
															>{format}</DropdownMenu.Item
														>
													{/each}
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</InputGroup.Addon>
									</InputGroup.Root>
								</div>
							{/if}

							<Switch
								value={isRuleEnabled('max_file_size')}
								onCheckedChange={(checked) => setRuleEnabled('max_file_size', checked)}
							/>
						</div>

						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<HardDriveIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Max package size</span>

							{#if isRuleEnabled('max_package_size')}
								<div transition:slide={{ axis: 'x', duration: 300 }}>
									<InputGroup.Root class="w-fit">
										<InputGroup.Input
											type="number"
											min="0"
											class="w-20 grow"
											bind:value={maxPackageSizeInput}
										/>
										<InputGroup.Addon align="inline-end" class="text-primary-foreground">
											<DropdownMenu.Root>
												<DropdownMenu.Trigger>
													{#snippet child({ props })}
														<InputGroup.Button {...props} variant="ghost">
															{maxPackageSizeFormat}
														</InputGroup.Button>
													{/snippet}
												</DropdownMenu.Trigger>
												<DropdownMenu.Content>
													<!-- eslint-disable-next-line svelte/require-each-key -->
													{#each FORMATS as format}
														<DropdownMenu.Item onclick={() => (maxPackageSizeFormat = format)}
															>{format}</DropdownMenu.Item
														>
													{/each}
												</DropdownMenu.Content>
											</DropdownMenu.Root>
										</InputGroup.Addon>
									</InputGroup.Root>
								</div>
							{/if}

							<Switch
								value={isRuleEnabled('max_package_size')}
								onCheckedChange={(checked) => setRuleEnabled('max_package_size', checked)}
							/>
						</div>

						<!-- TODO for Later
						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<FileCheckIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Allowed file types</span>

							{#if isRuleEnabled('allowed_file_types')}
								<Input type="password" />
							{/if}

							<Switch
								value={isRuleEnabled('allowed_file_types')}
								onCheckedChange={(checked) => setRuleEnabled('allowed_file_types', checked)}
							/>
						</div>
                    -->

						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<FlameIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Automatic Purge</span>

							<Switch
								value={isRuleEnabled('automatic_purge')}
								onCheckedChange={(checked) => setRuleEnabled('automatic_purge', checked)}
							/>
						</div>

						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<UserIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Require Credentials</span
							>

							<Switch
								value={isRuleEnabled('require_credentials')}
								onCheckedChange={(checked) => setRuleEnabled('require_credentials', checked)}
							/>
						</div>

						<!--TODO for Later
						<div class="flex h-16 flex-row items-center gap-2 py-3">
							<BellIcon class="size-5 shrink-0" />
							<span class="mr-10 ml-2 flex-1 shrink-0 text-sm text-nowrap">Notify me</span>

							<Switch
								value={isRuleEnabled('notification')}
								onCheckedChange={(checked) => setRuleEnabled('notification', checked)}
							/>
						</div>
                        -->
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="shrink-0">
				<Card.Header>
					<Card.Title>Preview</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col gap-4">
						<InputGroup.Root>
							<InputGroup.Addon align="inline-start">
								<LinkIcon />
							</InputGroup.Addon>
							<InputGroup.Input value="http://localhost:5173/s/x7k2-9fae" readonly />
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button
									aria-label="Copy"
									title="Copy"
									size="icon-xs"
									onclick={() => clipboard.copy('https://gonder.io/s/x7k2-9fae')}
								>
									{#if clipboard.copied}
										<CheckIcon />
									{:else}
										<CopyIcon />
									{/if}
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>

						<svg
							class="mx-auto w-1/2"
							use:qr={{
								data: 'http://localhost:5173/s/x7k2-9fae',
								logo: logo,
								shape: 'circle'
							}}
						/>

						<Separator />

						<span>Rules</span>
						<div class="flex flex-col gap-2">
							{#if activeRules.length > 0}
								<!-- eslint-disable-next-line svelte/require-each-key -->
								{#each activeRules as rule}
									<span>{rule!.id}</span>
								{/each}
							{:else}
								<span>No active rules</span>
							{/if}
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Button class="mt-auto" type="submit">Create Package</Button>
			<Sheet.Close>Cancel</Sheet.Close>
		</form>
	</Sheet.Content>
</Sheet.Root>
