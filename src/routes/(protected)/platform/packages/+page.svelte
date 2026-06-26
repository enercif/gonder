<script lang="ts">
	import { packageNameSnippet } from '$lib/components/snippets/package-name.snippet.svelte';
	import Rules from '$lib/components/snippets/rules.snippet.svelte';
	import { statusBadgeSnippet } from '$lib/components/snippets/status-badge.snippet.svelte';
	import { typeBadgeSnippet } from '$lib/components/snippets/type-badge.snippet.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Progress from '$lib/components/ui/progress/progress.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { getMyPackages } from '$lib/remote/package.remote';
	import { EllipsisVerticalIcon, HardDriveIcon } from '@lucide/svelte';

	const packages = await getMyPackages();
	const activePackagesCount = packages.filter((pack) => pack.status === 'active').length;
</script>

<div class="flex min-h-0 flex-1 flex-col gap-6">
	<Card.Root class="min-h-0 shrink-0">
		<Card.Content class="flex flex-col gap-2">
			<div class="flex flex-row items-center justify-between text-xs text-muted-foreground">
				<span>Storage</span>
				<HardDriveIcon class="size-4" />
			</div>

			<div class="flex flex-row items-baseline gap-1">
				<span class="text-2xl font-semibold">12</span>
				<span class="text-muted-foreground">/50 GB</span>
			</div>

			<Progress value={12} max={50} class="h-2" />
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
							<Table.Row>
								<Table.Cell>{@render packageNameSnippet(pack.name, pack.url)}</Table.Cell>
								<Table.Cell>{@render typeBadgeSnippet(pack.type)}</Table.Cell>
								<Table.Cell><Rules rules={pack.rules} /></Table.Cell>
								<Table.Cell>{@render statusBadgeSnippet(pack.status)}</Table.Cell>
								<Table.Cell>
									<Button size="icon" variant="ghost">
										<EllipsisVerticalIcon />
									</Button>
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
