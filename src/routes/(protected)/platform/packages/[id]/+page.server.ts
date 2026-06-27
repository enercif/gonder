import { getMyPackageById } from '$lib/remote/package.remote';
import { packageSchema } from '$lib/schemas/package.schema';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const pack = await getMyPackageById(params.id);
	return packageSchema.parse(pack);
};
