<script lang="ts">
	import { breadcrumbDetailState } from '$lib/state/breadcrumb-detail.state.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	onMount(() => {
		breadcrumbDetailState.current = data.name;
	});

	onDestroy(() => {
		breadcrumbDetailState.current = undefined;
	});
</script>

<p>{JSON.stringify(data)}</p>
