<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { packageNameSnippet } from '$lib/components/snippets/package-name.snippet.svelte';
	import { rulesSnippet } from '$lib/components/snippets/rules.snippet.svelte';
	import { statusBadgeSnippet } from '$lib/components/snippets/status-badge.snippet.svelte';
	import { typeBadgeSnippet } from '$lib/components/snippets/type-badge.snippet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { getMyFiles } from '$lib/remote/file.remote';
	import { getMyPackages } from '$lib/remote/package.remote';
	import { formatBytes } from '$lib/utils';
	import {
		BanIcon,
		EllipsisVerticalIcon,
		HardDriveIcon,
		PauseIcon,
		SquareArrowOutUpRightIcon
	} from '@lucide/svelte';

	const packages = $derived(await getMyPackages());
	const files = $derived(await getMyFiles());
	const usedBytes = $derived(files.reduce((sum, file) => sum + file.size, 0));
	const activePackagesCount = $derived(packages.filter((pack) => pack.status === 'active').length);
</script>

<div class="flex min-h-0 flex-1 flex-col gap-6">
	<Card.Root class="min-h-0 shrink-0">
		<Card.Content class="flex flex-col gap-2">
			<div class="flex flex-row items-center justify-between text-xs text-muted-foreground">
				<span>Storage</span>
				<HardDriveIcon class="size-4" />
			</div>

			<div class="flex flex-row items-baseline gap-1">
				<span class="text-2xl font-semibold">{formatBytes(usedBytes)}</span>
				<span class="text-muted-foreground">/50 MB</span>
			</div>

			<Progress value={usedBytes} max={50_000_000} class="h-2" />
		</Card.Content>
	</Card.Root>

	<Card.Root class="min-h-0">
		<Card.Content class="flex min-h-0 w-full flex-1 flex-col gap-4">
			{#if packages.length > 0}
				<div class="flex flex-row items-center justify-between">
					<Tabs.Root value="all" class="shrink-0">
						<Tabs.List>
							<Tabs.Trigger value="all">All</Tabs.Trigger>
							<Tabs.Trigger value="send">Send</Tabs.Trigger>
							<Tabs.Trigger value="receive">Receive</Tabs.Trigger>
							<Tabs.Trigger value="expired">Expired</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>

					<div class="flex flex-row items-baseline gap-0.5">
						<span class="text-xl font-semibold">{activePackagesCount}</span>
						<span class="text-muted-foreground">/{packages.length} active</span>
					</div>
				</div>

				<Table.Root containerClass="min-h-0 flex-1">
					<Table.Header class="sticky top-0 z-10 bg-card">
						<Table.Row>
							<Table.Head>Package</Table.Head>
							<Table.Head>Type</Table.Head>
							<Table.Head>Rules</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head class="w-0">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each packages as pack (pack.id)}
							<Table.Row
								class="cursor-pointer"
								onclick={() =>
									goto(resolve('/(protected)/platform/packages/[id]', { id: pack.id }))}
							>
								<Table.Cell>{@render packageNameSnippet(pack.name, pack.url)}</Table.Cell>
								<Table.Cell>{@render typeBadgeSnippet(pack.type)}</Table.Cell>
								<Table.Cell>{@render rulesSnippet(pack.rules)}</Table.Cell>
								<Table.Cell>{@render statusBadgeSnippet(pack.status)}</Table.Cell>
								<Table.Cell>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											{#snippet child({ props })}
												<Button {...props} size="icon" variant="ghost">
													<EllipsisVerticalIcon />
												</Button>
											{/snippet}
										</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Group>
												<DropdownMenu.Item
													class="flex flex-row items-center justify-between"
													onclick={() =>
														goto(
															resolve('/(protected)/platform/packages/[id]', {
																id: pack.id
															})
														)}
												>
													Details
													<SquareArrowOutUpRightIcon />
												</DropdownMenu.Item>

												<DropdownMenu.Item class="flex flex-row items-center justify-between">
													Deactivate
													<PauseIcon />
												</DropdownMenu.Item>

												<DropdownMenu.Item class="flex flex-row items-center justify-between">
													Expire
													<BanIcon />
												</DropdownMenu.Item>
											</DropdownMenu.Group>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<p>You have no packages yet. Create a new package to get started.</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
