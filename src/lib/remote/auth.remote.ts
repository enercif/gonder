import { form } from '$app/server';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { z } from 'zod';

// Schemas
export const emailSignUpSchema = z.object({
	email: z.email(),
	name: z.string().min(1, 'Name is required'),
	password: z.string().min(1, 'Password is required')
});

export const emailSignInSchema = z.object({
	email: z.email(),
	password: z.string().min(1, 'Password is required')
});

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

	return returnSuccess();
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

	return returnSuccess();
});

// Helpers
function returnError(message: string) {
	return {
		success: false,
		message
	};
}

function returnSuccess() {
	return {
		success: true
	};
}
