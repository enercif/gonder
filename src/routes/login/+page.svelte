<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import LoginForm from './login-form.svelte';
	import SignupForm from './signup-form.svelte';
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Tabs.Root value="login" class="mx-auto w-full max-w-sm">
		<Tabs.List>
			<Tabs.Trigger value="login">Login</Tabs.Trigger>
			<Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="login">
			<LoginForm />
		</Tabs.Content>
		<Tabs.Content value="signup">
			<SignupForm />
		</Tabs.Content>
	</Tabs.Root>
</div>
