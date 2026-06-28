<script lang="ts">
	import { cn } from '$lib/utils';
	import { CloudUploadIcon, Loader2Icon } from '@lucide/svelte';

	interface Props {
		onfiles: (files: File[]) => void;
		pending?: boolean;
		disabled?: boolean;
		class?: string;
	}

	let { onfiles, pending = false, disabled = false, class: className }: Props = $props();

	let dragging = $state(false);
	let input = $state<HTMLInputElement>();

	function emit(list: FileList | null | undefined) {
		if (!list || list.length === 0) return;
		onfiles(Array.from(list));
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		if (disabled || pending) return;
		emit(event.dataTransfer?.files);
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
		if (disabled || pending) return;
		dragging = true;
	}

	function onChange(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		emit(target.files);
		target.value = '';
	}
</script>

<button
	type="button"
	{disabled}
	onclick={() => input?.click()}
	ondrop={onDrop}
	ondragover={onDragOver}
	ondragleave={() => (dragging = false)}
	class={cn(
		'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-6 py-10 text-center transition-colors',
		'hover:border-primary/50 hover:bg-muted/50',
		dragging && 'border-primary bg-primary/5',
		(disabled || pending) && 'pointer-events-none opacity-60',
		className
	)}
>
	{#if pending}
		<Loader2Icon class="size-6 animate-spin text-muted-foreground" />
		<span class="text-sm text-muted-foreground">Uploading…</span>
	{:else}
		<CloudUploadIcon class="size-6 text-muted-foreground" />
		<span class="text-sm font-medium">
			Drag &amp; drop files here, or <span class="text-primary">browse</span>
		</span>
		<span class="text-xs text-muted-foreground">Add more files to this package</span>
	{/if}
</button>

<input bind:this={input} type="file" multiple class="hidden" onchange={onChange} {disabled} />
