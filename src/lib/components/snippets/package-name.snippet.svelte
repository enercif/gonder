<script module>
	export { packageNameSnippet };
</script>

<script lang="ts"></script>

{#snippet packageNameSnippet(name: string, url: string)}
	<div class="flex w-fit flex-col items-start gap-1">
		<span>{name}</span>
		<span class="text-xs text-muted-foreground">{url}</span>
	</div>
{/snippet}
