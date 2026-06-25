<script lang="ts">
	import LoginForm from '$lib/components/forms/login-form.svelte';
	import SignupForm from '$lib/components/forms/signup-form.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
</script>

<div
	class="flex h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,var(--primary)_-25%,var(--background)_50%)] px-4"
>
	<Tabs.Root value="in" class="mx-auto w-full max-w-sm">
		<Tabs.List class="w-full">
			<Tabs.Trigger value="in">Sign In</Tabs.Trigger>
			<Tabs.Trigger value="up">Create Account</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="in">
			<LoginForm />
		</Tabs.Content>
		<Tabs.Content value="up">
			<SignupForm />
		</Tabs.Content>
	</Tabs.Root>
</div>
