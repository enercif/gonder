<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import src from '$lib/assets/icon.png';
	import { authClient } from '$lib/auth-client';
	import NewPackage from '$lib/components/new-package.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { navigation } from '$lib/const/navigation';
	import { setLocale } from '$lib/paraglide/runtime';
	import { breadcrumbDetailState } from '$lib/state/breadcrumb-detail.state.svelte';
	import { BellIcon, LanguagesIcon } from '@lucide/svelte';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { resetMode, setMode } from 'mode-watcher';
	import { PersistedState } from 'runed';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const persistedSidebarState = new PersistedState('sidebar', false);

	const currentRoute = $derived(page.route.id?.split('/').slice(2) ?? []);

	const currentNavGroup = $derived(
		navigation.find((group) => group.path === `/${currentRoute[0]}`)
	);

	const currentNavItem = $derived(
		currentNavGroup?.items.find((item) => item.href === `/${currentRoute[1]}`)
	);

	async function signOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto(resolve('/login'));
				}
			}
		});
	}
</script>

<Sidebar.Provider class="h-screen max-h-screen" bind:open={persistedSidebarState.current}>
	<Sidebar.Root collapsible="icon">
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton {...props} size="lg">
									<img {src} alt="Gonder Logo" class="size-8 rounded-md" />
									<span class="truncate font-medium">gonder</span>
									<ChevronsUpDownIcon class="ml-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content side="right" align="start">
							<DropdownMenu.Label>
								<div class="grid flex-1 text-start text-sm leading-tight">
									<span class="truncate font-medium">{data.user.name}</span>
									<span class="truncate text-xs text-muted-foreground">
										{data.user.email}
									</span>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<SettingsIcon />
								Settings
							</DropdownMenu.Item>

							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<LanguagesIcon />
									Locale
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item onclick={() => setLocale('de')}>German</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => setLocale('en')}>English</DropdownMenu.Item>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>

							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<SunIcon
										class="scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
									/>
									<MoonIcon
										class="absolute scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
									/> Theme
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item onclick={() => setMode('dark')}>Dark</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => setMode('light')}>Light</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => resetMode()}>System</DropdownMenu.Item>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>

							<DropdownMenu.Separator />
							<DropdownMenu.Item onclick={signOut}>
								<LogOutIcon />
								Log Out
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<!-- eslint-disable-next-line svelte/require-each-key -->
			{#each navigation as navGroup}
				<Sidebar.Group>
					<Sidebar.GroupLabel>{navGroup.label}</Sidebar.GroupLabel>
					<Sidebar.Menu>
						<!-- eslint-disable-next-line svelte/require-each-key -->
						{#each navGroup.items as navItem}
							{@const active =
								currentNavGroup?.path === navGroup.path && currentNavItem?.href === navItem.href}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton tooltipContent={navItem.label} isActive={active}>
									{#snippet child({ props })}
										<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
										<a href={navGroup.path + navItem.href} {...props}>
											<navItem.icon class={[active && 'text-primary']} />
											{navItem.label}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.Group>
			{/each}
		</Sidebar.Content>
	</Sidebar.Root>
	<main class="flex h-svh w-full min-w-0 flex-col overflow-hidden">
		<div
			class="flex w-full shrink-0 flex-row items-center gap-4 border-b border-b-border bg-background px-4 py-2.5"
		>
			<Sidebar.Trigger />

			{#if currentNavGroup && currentNavItem}
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link>{currentNavGroup.label}</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator />

						{#if breadcrumbDetailState.current}
							<Breadcrumb.Item>
								<Breadcrumb.Link
									href={currentNavGroup.path + currentNavItem.href}
									class="flex items-center gap-1"
								>
									<currentNavItem.icon class="size-4" />
									{currentNavItem.label}
								</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />

							<Breadcrumb.Item>
								<Breadcrumb.Page class="flex items-center gap-1">
									{breadcrumbDetailState.current}
								</Breadcrumb.Page>
							</Breadcrumb.Item>
						{:else}
							<Breadcrumb.Item>
								<Breadcrumb.Page class="flex items-center gap-1">
									<currentNavItem.icon class="size-4" />
									{currentNavItem.label}
								</Breadcrumb.Page>
							</Breadcrumb.Item>
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			{/if}

			<div class="ml-auto flex flex-row items-center gap-2">
				<Button size="icon" variant="outline">
					<BellIcon />
				</Button>
				<NewPackage />
			</div>
		</div>
		<div class="flex min-h-0 flex-1 flex-col overflow-y-auto bg-background p-6">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>
