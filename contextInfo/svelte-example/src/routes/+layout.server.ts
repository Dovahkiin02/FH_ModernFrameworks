import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	if (!user && !url.pathname.startsWith('/auth') && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/signup')) {
		redirect(302, '/login');
	}

	return { user: user ? { id: user.id, email: user.email ?? '' } : null };
};
