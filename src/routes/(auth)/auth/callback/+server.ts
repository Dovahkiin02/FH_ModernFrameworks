import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');

	if (code && locals.supabase) {
		try {
			await locals.supabase.auth.exchangeCodeForSession(code);
		} catch {
			redirect(303, '/login');
		}
	}

	redirect(303, locals.supabase ? '/play' : '/login');
};
