<script lang="ts">
	import { resolve } from '$app/paths';
	import FileDropzone from '$lib/components/file-dropzone.svelte';
	import { statusBadgeSnippet } from '$lib/components/snippets/status-badge.snippet.svelte';
	import { typeBadgeSnippet } from '$lib/components/snippets/type-badge.snippet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { UseClipboard } from '$lib/hooks/use-clipboard.svelte.js';
	import { activityMeta } from '$lib/meta/activity-meta';
	import { ruleMeta } from '$lib/meta/rule-meta';
	import { getPackageActivity } from '$lib/remote/activity.remote';
	import { addPackageFiles, deletePackageFile, getPackageFiles } from '$lib/remote/file.remote';
	import type { Rule } from '$lib/schemas/rule.schema';
	import { breadcrumbDetailState } from '$lib/state/breadcrumb-detail.state.svelte';
	import { findRule, formatBytes, formatRelativeTime } from '$lib/utils';
	import { getLocalTimeZone, now, parseZonedDateTime } from '@internationalized/date';
	import {
		ArrowLeftIcon,
		ChevronDownIcon,
		CopyIcon,
		FileIcon,
		HardDriveIcon,
		LinkIcon,
		PauseIcon,
		PencilIcon,
		RotateCcwIcon,
		SquareArrowOutUpRightIcon,
		Trash2Icon
	} from '@lucide/svelte';
	import { PersistedState } from 'runed';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const clipboard = new UseClipboard();
	let uploading = $state(false);

	const files = $derived(await getPackageFiles(data.id));
	const activity = $derived(await getPackageActivity(data.id));

	const usedBytes = $derived(files.reduce((sum, file) => sum + file.size, 0));
	const maxPackageSize = $derived(findRule(data.rules, 'max_package_size')?.bytes);

	const enabledRules = $derived(data.rules.filter((rule) => rule.enabled));

	const showRules = new PersistedState('package-rules', true);
	const showActions = new PersistedState('package-actions', true);
	const showActivity = new PersistedState('package-activity', true);
	const showFiles = new PersistedState('package-files', true);

	onMount(() => {
		breadcrumbDetailState.current = data.name;
	});

	onDestroy(() => {
		breadcrumbDetailState.current = undefined;
	});

	function ruleValue(rule: Rule): string | undefined {
		switch (rule.id) {
			case 'max_download':
				return `${rule.limit}`;
			case 'max_file_count':
				return `${rule.limit}`;
			case 'max_file_size':
				return formatBytes(rule.bytes);
			case 'max_package_size':
				return formatBytes(rule.bytes);
			case 'expiration': {
				const days = Math.round(
					parseZonedDateTime(rule.expiresAt).compare(now(getLocalTimeZone())) / 1000 / 60 / 60 / 24
				);
				return `${days}d`;
			}
			case 'allowed_file_types':
				return rule.types.join(', ');
			case 'notification':
				return rule.channels.join(', ');
			default:
				return 'On';
		}
	}

	async function copyUrl() {
		await clipboard.copy(data.url);
		toast.success('Link copied to clipboard');
	}

	async function handleFiles(dropped: File[]) {
		uploading = true;
		try {
			await addPackageFiles({
				packageId: data.id,
				files: dropped.map((file) => ({
					name: file.name,
					size: file.size,
					mimeType: file.type || null
				}))
			});
			toast.success(dropped.length === 1 ? 'File added' : `${dropped.length} files added`);
		} catch {
			toast.error('Failed to add files');
		} finally {
			uploading = false;
		}
	}

	async function removeFile(fileId: string, name: string) {
		try {
			await deletePackageFile({ packageId: data.id, fileId });
			toast.success(`Removed ${name}`);
		} catch {
			toast.error('Failed to remove file');
		}
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col">
		<div class="flex flex-row items-center justify-between">
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<div class="flex flex-row items-center gap-4">
						<h1 class="text-lg font-semibold">{data.name}</h1>
						{@render statusBadgeSnippet(data.status)}
					</div>
				</div>

				<div class="flex flex-row items-center gap-1">
					{@render typeBadgeSnippet(data.type)}
					<span class="text-xs">
						- created {formatRelativeTime(data.createdAt)}
					</span>
				</div>
			</div>

			<Button variant="secondary" href={resolve('/(protected)/platform/packages')}>
				<ArrowLeftIcon />
				Back
			</Button>
		</div>

		{#if data.description}
			<p class="mt-4 max-w-prose text-sm text-muted-foreground">{data.description}</p>
		{/if}
	</div>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<Card.Root class="col-span-full py-2">
			<Card.Content class="flex flex-row items-center justify-between ">
				<div
					class={[
						'flex flex-row items-center gap-2',
						data.type === 'send' && 'text-blue-600 dark:text-blue-400',
						data.type === 'receive' && 'text-purple-600 dark:text-purple-400'
					]}
				>
					<LinkIcon class="size-4" />
					<span>{data.url}</span>
				</div>

				<div class="flex flex-row items-center gap-2">
					<Button size="sm" variant="secondary" onclick={copyUrl}>
						<CopyIcon />
						Copy
					</Button>

					<Button size="sm" variant="secondary" href={data.url} target="_blank">
						<SquareArrowOutUpRightIcon />
						Open
					</Button>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-span-full">
			<Card.Content class="flex flex-col gap-2">
				<div class="flex flex-row items-center justify-between text-xs text-muted-foreground">
					<span>Storage</span>
					<HardDriveIcon class="size-4" />
				</div>
				<div class="flex flex-row items-baseline gap-1">
					<span class="text-2xl font-semibold">{formatBytes(usedBytes)}</span>
					{#if maxPackageSize}
						<span class="text-muted-foreground">/ {formatBytes(maxPackageSize)}</span>
					{/if}
				</div>
				{#if maxPackageSize}
					<Progress value={usedBytes} max={maxPackageSize} class="h-2" />
				{/if}
				<span class="text-xs text-muted-foreground">
					{files.length}
					{files.length === 1 ? 'file' : 'files'}
				</span>
			</Card.Content>
		</Card.Root>

		<div class="flex flex-col gap-6 lg:col-span-2">
			<Card.Root class="min-h-0">
				<Card.Header
					class="flex cursor-pointer flex-row items-center justify-between"
					onclick={() => (showFiles.current = !showFiles.current)}
				>
					<Card.Title>Files</Card.Title>
					<ChevronDownIcon class={['size-4 duration-300', showFiles.current && 'rotate-180']} />
				</Card.Header>
				<Card.Content class="flex flex-col gap-4">
					<FileDropzone onfiles={handleFiles} pending={uploading} />

					{#if showFiles.current}
						<div transition:slide>
							{#if files.length > 0}
								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.Head>Name</Table.Head>
											<Table.Head class="w-0">Size</Table.Head>
											<Table.Head class="w-0 whitespace-nowrap">Added</Table.Head>
											<Table.Head class="w-0"></Table.Head>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{#each files as file (file.id)}
											<Table.Row>
												<Table.Cell>
													<div class="flex flex-row items-center gap-2">
														<FileIcon class="size-4 shrink-0 text-muted-foreground" />
														<span class="truncate">{file.name}</span>
													</div>
												</Table.Cell>
												<Table.Cell class="whitespace-nowrap text-muted-foreground">
													{formatBytes(file.size)}
												</Table.Cell>
												<Table.Cell class="whitespace-nowrap text-muted-foreground">
													{formatRelativeTime(file.createdAt)}
												</Table.Cell>
												<Table.Cell>
													<Button
														size="icon"
														variant="ghost"
														class="text-destructive"
														onclick={() => removeFile(file.id, file.name)}
													>
														<Trash2Icon />
													</Button>
												</Table.Cell>
											</Table.Row>
										{/each}
									</Table.Body>
								</Table.Root>
							{:else}
								<p class="text-sm text-muted-foreground">No files in this package yet.</p>
							{/if}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header
					class="flex cursor-pointer flex-row items-center justify-between"
					onclick={() => (showActivity.current = !showActivity.current)}
				>
					<Card.Title>Activity</Card.Title>
					<ChevronDownIcon class={['size-4 duration-300', showActivity.current && 'rotate-180']} />
				</Card.Header>
				{#if showActivity.current}
					<div transition:slide>
						<Card.Content>
							{#if activity.length > 0}
								<div class="flex max-h-100 flex-col divide-y divide-border overflow-y-scroll">
									{#each activity as entry (entry.id)}
										{@const Meta = activityMeta[entry.type]}
										<div class="flex flex-row gap-4 py-3">
											<div class="grid items-center">
												<Meta.icon class="size-5 text-muted-foreground {Meta.colours}" />
											</div>
											<div class="flex flex-col">
												<span class="text-sm font-medium">{Meta.label}</span>
												{#if entry.detail}
													<span class="text-xs text-muted-foreground">{entry.detail}</span>
												{/if}
											</div>

											<span class="ml-auto text-xs text-muted-foreground">
												{formatRelativeTime(entry.createdAt)}
											</span>
										</div>
									{/each}
								</div>
							{:else}
								<p class="text-sm text-muted-foreground">No activity recorded yet.</p>
							{/if}
						</Card.Content>
					</div>
				{/if}
			</Card.Root>
		</div>

		<div class="flex flex-col gap-6">
			<Card.Root>
				<Card.Header
					class="flex cursor-pointer flex-row items-center justify-between"
					onclick={() => (showRules.current = !showRules.current)}
				>
					<Card.Title>Rules</Card.Title>
					<ChevronDownIcon class={['size-4 duration-300', showRules.current && 'rotate-180']} />
				</Card.Header>
				{#if showRules.current}
					<div transition:slide>
						<Card.Content class="flex flex-col gap-3 divide-y divide-border">
							{#if enabledRules.length > 0}
								{#each enabledRules as rule (rule.id)}
									{@const Meta = ruleMeta[rule.id]}
									<div class="flex h-9 flex-row items-start justify-between gap-3">
										<div class="flex flex-row items-center gap-2">
											<Meta.icon class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
											<span class="text-xs">{Meta.title}</span>
										</div>
										{#if ruleValue(rule)}
											<span class="shrink-0 text-sm font-medium whitespace-nowrap">
												{ruleValue(rule)}
											</span>
										{/if}
									</div>
								{/each}
							{:else}
								<p class="text-sm text-muted-foreground">No rules configured.</p>
							{/if}
						</Card.Content>
					</div>
				{/if}
			</Card.Root>

			<Card.Root>
				<Card.Header
					class="flex cursor-pointer flex-row items-center justify-between"
					onclick={() => (showActions.current = !showActions.current)}
				>
					<Card.Title>Actions</Card.Title>
					<ChevronDownIcon class={['size-4 duration-300', showActions.current && 'rotate-180']} />
				</Card.Header>
				{#if showActions.current}
					<div transition:slide>
						<Card.Content>
							<div class="flex flex-col gap-2">
								<Button variant="secondary">
									<PencilIcon />
									Edit Package
								</Button>

								<Button variant="secondary">
									<PauseIcon />
									Deactivate Package
								</Button>
								<Separator orientation="horizontal" class="my-2" />

								<div class="mb-2 flex flex-col">
									<span class="text-destructive">Danger zone</span>
									<span class="text-xs text-muted-foreground">These actions cannot be undone</span>
								</div>

								<Button variant="destructive">
									<RotateCcwIcon />
									Regenerate Link
								</Button>

								<Button variant="destructive">
									<Trash2Icon />
									Delete Package
								</Button>
							</div>
						</Card.Content>
					</div>
				{/if}
			</Card.Root>
		</div>
	</div>
</div>
