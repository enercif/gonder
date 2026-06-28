<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/assets/icon.png';
	import ExpirationInput from '$lib/components/expiration-input.svelte';
	import SizeInput from '$lib/components/size-input.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { createEmptyRules } from '$lib/const/empty';
	import type { PackageType } from '$lib/const/package-types';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte.js';
	import { ruleMeta } from '$lib/meta/rule-meta';
	import { createPackage } from '$lib/remote/package.remote';
	import { packageCreateSchema } from '$lib/schemas/package.schema';
	import type { Rule } from '$lib/schemas/rule.schema';
	import { generateId } from '$lib/utils';
	import {
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
		SendIcon,
		ShieldCheckIcon,
		UserIcon
	} from '@lucide/svelte';
	import { qr } from '@svelte-put/qr/svg';
	import type { Component, Snippet } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import Separator from './ui/separator/separator.svelte';
	import Switch from './ui/switch/switch.svelte';
	import Textarea from './ui/textarea/textarea.svelte';

	const clipboard = new UseClipboard();

	let sheetOpen = $state(false);
	let pending = $state(false);
	let issues = $state<string[]>([]);

	let id = $state(generateId());
	let name = $state('');
	let description = $state('');
	let type = $state<PackageType>('send');
	let rules = $state(createEmptyRules());

	const activeRules = $derived(Object.values(rules).filter((rule) => rule.enabled));
	const shareUrl = $derived(`${page.url.origin}/${type === 'send' ? 's' : 'r'}/${id}`);

	function reset() {
		id = generateId();
		name = '';
		description = '';
		type = 'send';
		rules = createEmptyRules();
		issues = [];
	}

	async function submit() {
		const parsed = packageCreateSchema.safeParse({
			id,
			name,
			description,
			type,
			rules: Object.values(rules)
		});

		if (!parsed.success) {
			issues = parsed.error.issues.map((issue) => issue.message);
			return;
		}
		issues = [];

		pending = true;
		try {
			await createPackage(parsed.data);
			toast.success('Package created');
			sheetOpen = false;
			reset();
		} catch {
			toast.error('Could not create package');
		} finally {
			pending = false;
		}
	}
</script>

{#snippet ruleRow(Icon: Component<{ class?: string }>, ruleId: Rule['id'], control?: Snippet)}
	<div class="flex h-16 flex-row items-center gap-2 py-3">
		<Icon class="size-5 shrink-0" />
		<div class="text-nowra mr-10 ml-2 flex flex-1 shrink-0 flex-col">
			<span class="text-sm leading-none font-medium">{ruleMeta[ruleId].title}</span>
			{#if !rules[ruleId].enabled}
				<span class="mt-1 text-xs text-muted-foreground">
					{ruleMeta[ruleId].description}
				</span>
			{/if}
		</div>

		{#if control && rules[ruleId].enabled}
			<div transition:slide={{ axis: 'x', duration: 300 }}>
				{@render control()}
			</div>
		{/if}

		<Switch bind:checked={rules[ruleId].enabled} aria-label={ruleMeta[ruleId].title} />
	</div>
{/snippet}

<Sheet.Root bind:open={sheetOpen}>
	<Sheet.Trigger class={buttonVariants({ variant: 'default' })} onclick={reset}>
		<PlusIcon />
		New Package
	</Sheet.Trigger>
	<Sheet.Content class=" sm:max-w-150!">
		<Sheet.Header>
			<Sheet.Title>Create a new Package</Sheet.Title>
			<Sheet.Description>Choose a direction and rules for the Package</Sheet.Description>
		</Sheet.Header>

		<div class="flex size-full flex-col gap-4 overflow-y-scroll px-4 pb-4">
			<Tabs.Root value={type} onValueChange={(value) => (type = value as PackageType)}>
				<Tabs.List class="w-full">
					<Tabs.Trigger
						value="send"
						class="data-active:border-blue-600! dark:data-active:border-blue-400"
					>
						<SendIcon class="size-4 text-blue-600 dark:text-blue-400" />
						Send
					</Tabs.Trigger>
					<Tabs.Trigger
						value="receive"
						class="data-active:border-purple-600! dark:data-active:border-purple-400"
					>
						<SendIcon class="size-4 rotate-180 text-purple-600 dark:text-purple-400" />
						Receive
					</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>

			<Card.Root class="shrink-0">
				<Card.Header>
					<Card.Title>Details</Card.Title>
				</Card.Header>
				<Card.Content>
					<Field.Set>
						<Field.Group>
							<Field.Field>
								<Field.Label for="name">Package Name</Field.Label>
								<Input id="name" bind:value={name} aria-invalid={issues.length > 0 && !name} />
							</Field.Field>
							<Field.Field>
								<Field.Label for="description">Description (optional)</Field.Label>
								<Textarea id="description" bind:value={description} />
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
						<span class="text-xs">
							{activeRules.length === 0 ? 'No active rules' : `${activeRules.length} active rules`}
						</span>
					</span>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col divide-y divide-border">
						{@render ruleRow(DownloadIcon, 'max_download', maxDownloadControl)}
						{@render ruleRow(FileStackIcon, 'max_file_count', maxFileCountControl)}
						{@render ruleRow(ClockIcon, 'expiration', expirationControl)}
						{@render ruleRow(LockIcon, 'password', passwordControl)}
						{@render ruleRow(FileScanIcon, 'max_file_size', fileSizeControl)}
						{@render ruleRow(HardDriveIcon, 'max_package_size', packageSizeControl)}
						{@render ruleRow(FlameIcon, 'automatic_purge')}
						{@render ruleRow(UserIcon, 'require_credentials')}
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
							<InputGroup.Input value={shareUrl} readonly />
							<InputGroup.Addon align="inline-end">
								<InputGroup.Button
									aria-label="Copy"
									title="Copy"
									size="icon-xs"
									onclick={() => clipboard.copy(shareUrl)}
								>
									{#if clipboard.copied}
										<CheckIcon />
									{:else}
										<CopyIcon />
									{/if}
								</InputGroup.Button>
							</InputGroup.Addon>
						</InputGroup.Root>

						<svg class="mx-auto w-1/2" use:qr={{ data: shareUrl, logo, shape: 'circle' }} />

						<Separator />

						<span>Rules</span>
						<div class="flex flex-col gap-3">
							{#if activeRules.length > 0}
								{#each activeRules as rule (rule.id)}
									<div class="flex flex-row items-start gap-2">
										<CheckIcon class="mt-0.5 size-4 shrink-0 text-emerald-500" />
										<span class="text-sm leading-none font-medium">{ruleMeta[rule.id].title}</span>
									</div>
								{/each}
							{:else}
								<span class="text-sm text-muted-foreground">No active rules</span>
							{/if}
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			{#if issues.length > 0}
				<div class="flex flex-col gap-1 text-sm text-destructive">
					{#each issues as issue, i (i)}
						<span>{issue}</span>
					{/each}
				</div>
			{/if}

			<Button class="mt-auto" onclick={submit} disabled={pending}>
				{pending ? 'Creating…' : 'Create Package'}
			</Button>
			<Sheet.Close>Cancel</Sheet.Close>
		</div>
	</Sheet.Content>
</Sheet.Root>

{#snippet maxDownloadControl()}
	<Input type="number" min="1" max="100" class="w-20" bind:value={rules.max_download.limit} />
{/snippet}

{#snippet maxFileCountControl()}
	<Input type="number" min="1" max="100" class="w-20" bind:value={rules.max_file_count.limit} />
{/snippet}

{#snippet expirationControl()}
	<ExpirationInput bind:value={rules.expiration.expiresAt} />
{/snippet}

{#snippet passwordControl()}
	<Input type="password" bind:value={rules.password.password} />
{/snippet}

{#snippet fileSizeControl()}
	<SizeInput bind:bytes={rules.max_file_size.bytes} label="Max file size" />
{/snippet}

{#snippet packageSizeControl()}
	<SizeInput bind:bytes={rules.max_package_size.bytes} label="Max package size" />
{/snippet}
