import { form } from '$app/server';
import { emailSignInSchema, emailSignUpSchema } from '$lib/schemas/auth.schema';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { APIError } from 'better-auth/api';

// Forms
export const signUpEmailForm = form(emailSignUpSchema, async ({ email, password, name }) => {
	try {
		await auth.api.signUpEmail({
			body: {
				email,
				password,
				name
			}
		});
	} catch (error) {
		if (error instanceof APIError) {
			return returnError(error.message || 'Registration failed');
		}
		return returnError('Unexpected error');
	}

	return redirect(307, '/');
});

export const signInEmailForm = form(emailSignInSchema, async ({ email, password }) => {
	try {
		await auth.api.signInEmail({
			body: {
				email,
				password
			}
		});
	} catch (error) {
		if (error instanceof APIError) {
			return returnError(error.message || 'Signin failed');
		}
		return returnError('Unexpected error');
	}

	return redirect(307, '/');
});

// Helpers
function returnError(message: string) {
	return {
		success: false,
		message
	};
}
