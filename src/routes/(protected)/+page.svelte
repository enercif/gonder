<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import Button from '$lib/components/ui/button/button.svelte';

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

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Button onclick={signOut}>Sign Out</Button>
