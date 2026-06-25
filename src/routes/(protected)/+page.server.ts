import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../login/$types';

export const load: PageServerLoad = async () => {
	redirect(307, '/platform/packages');
};
