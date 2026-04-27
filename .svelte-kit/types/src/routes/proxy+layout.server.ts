// @ts-nocheck
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	const { user } = await locals.safeGetSession();

	return {
		user: user ? { id: user.id, email: user.email ?? '' } : null,
		supabaseConfigured: locals.supabaseConfigured
	};
};
