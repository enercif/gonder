import { z } from 'zod';

// Schemas
export const emailSignUpSchema = z.object({
	email: z.email(),
	name: z.string().min(1, 'Name is required'),
	password: z.string('Password is required').min(8, 'Password must be at least 8 characters long')
});

export const emailSignInSchema = z.object({
	email: z.email(),
	password: z.string('Password is required')
});
