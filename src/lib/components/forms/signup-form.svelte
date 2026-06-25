<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Field, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { placeholderUsers } from '$lib/const/placeholders';
	import { signUpEmailForm } from '$lib/remote/auth.remote';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';

	const id = $props.id();
	const randomPlaceholder = placeholderUsers[Math.floor(Math.random() * placeholderUsers.length)];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="text-2xl">Create your account</Card.Title>
		<Card.Description>Set up access to this gonder instance</Card.Description>
	</Card.Header>
	<Card.Content>
		<form {...signUpEmailForm}>
			<FieldGroup>
				<Field data-invalid={!!signUpEmailForm.fields.name.issues()}>
					<FieldLabel for="name-{id}">Name</FieldLabel>
					<Input
						id="name-{id}"
						type="text"
						placeholder={randomPlaceholder.name}
						{...signUpEmailForm.fields.name.as('text')}
					/>
					<!--eslint-disable-next-line svelte/require-each-key-->
					{#each signUpEmailForm.fields.name.issues() as issue}
						<FieldError>{issue.message}</FieldError>
					{/each}
				</Field>
				<Field data-invalid={!!signUpEmailForm.fields.email.issues()}>
					<FieldLabel for="email-{id}">Email</FieldLabel>
					<Input
						id="email-{id}"
						placeholder={randomPlaceholder.email}
						{...signUpEmailForm.fields.email.as('email')}
					/>
					<!--eslint-disable-next-line svelte/require-each-key-->
					{#each signUpEmailForm.fields.email.issues() as issue}
						<FieldError>{issue.message}</FieldError>
					{/each}
				</Field>
				<Field data-invalid={!!signUpEmailForm.fields.password.issues()}>
					<FieldLabel for="password-{id}">Password</FieldLabel>
					<Input id="password-{id}" {...signUpEmailForm.fields.password.as('password')} />
					<!--eslint-disable-next-line svelte/require-each-key-->
					{#each signUpEmailForm.fields.password.issues() as issue}
						<FieldError>{issue.message}</FieldError>
					{/each}
				</Field>
				<Button type="submit" class="w-full">
					Create Account
					<ArrowRightIcon />
				</Button>
			</FieldGroup>
		</form>

		{#if signUpEmailForm.result && !signUpEmailForm.result.success}
			<Alert.Root variant="destructive" class="mt-4">
				<CircleAlertIcon />
				<Alert.Title>
					{signUpEmailForm.result.message}
				</Alert.Title>
			</Alert.Root>
		{/if}
	</Card.Content>
</Card.Root>
