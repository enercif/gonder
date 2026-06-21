<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import FieldError from '$lib/components/ui/field/field-error.svelte';
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { placeholderUsers } from '$lib/const/placeholders';
	import { signInEmailForm } from '$lib/remote/auth.remote';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

	const id = $props.id();

	const randomPlaceholder = placeholderUsers[Math.floor(Math.random() * placeholderUsers.length)];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form {...signInEmailForm}>
			<FieldGroup>
				<Field data-invalid={!!signInEmailForm.fields.email.issues()}>
					<FieldLabel for="email-{id}">Email</FieldLabel>
					<Input
						id="email-{id}"
						placeholder={randomPlaceholder.email}
						{...signInEmailForm.fields.email.as('email')}
					/>
					<!--eslint-disable-next-line svelte/require-each-key-->
					{#each signInEmailForm.fields.email.issues() as issue}
						<FieldError>{issue.message}</FieldError>
					{/each}
				</Field>
				<Field data-invalid={!!signInEmailForm.fields.password.issues()}>
					<div class="flex items-center">
						<FieldLabel for="password-{id}">Password</FieldLabel>
						<a href="##" class="ms-auto inline-block text-sm underline"> Forgot your password? </a>
					</div>

					<Input id="password-{id}" {...signInEmailForm.fields.password.as('password')} />

					<!--eslint-disable-next-line svelte/require-each-key-->
					{#each signInEmailForm.fields.password.issues() as issue}
						<FieldError>{issue.message}</FieldError>
					{/each}
				</Field>
				<Button type="submit" class="w-full">Login</Button>
			</FieldGroup>
		</form>

		{#if signInEmailForm.result && !signInEmailForm.result.success}
			<Alert.Root variant="destructive" class="mt-4">
				<CircleAlertIcon />
				<Alert.Title>Email and/or password is incorrect</Alert.Title>
			</Alert.Root>
		{/if}
	</Card.Content>
</Card.Root>
