import { z } from 'zod';

export const fileSchema = z.object({
	id: z.string().min(1),
	packageId: z.string().min(1),
	name: z.string().min(1),
	size: z.number().int().nonnegative(),
	mimeType: z.string().nullable(),
	createdAt: z.string().min(1)
});

export const fileCreateSchema = z.object({
	packageId: z.string().min(1),
	files: z
		.array(
			z.object({
				name: z.string().min(1),
				size: z.number().int().nonnegative(),
				mimeType: z.string().nullable().default(null)
			})
		)
		.min(1)
});

export type File = z.infer<typeof fileSchema>;
export type FileCreate = z.infer<typeof fileCreateSchema>;
