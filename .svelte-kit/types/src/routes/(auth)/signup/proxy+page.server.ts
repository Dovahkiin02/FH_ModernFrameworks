// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { SUPABASE_CONFIG_ERROR } from '$lib/supabase/config';
import type { Actions, PageServerLoad } from './$types';
import { formatSupabaseRequestError } from '$lib/supabase/errors';

export const load = async ({ parent }: Parameters<PageServerLoad>[0]) => {
	const { user } = await parent();
	if (user) {
		redirect(303, '/play');
	}
};

export const actions = {
	submit: async ({ request, locals, url }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!locals.supabase) {
			return fail(503, { error: SUPABASE_CONFIG_ERROR, email });
		}

		let data;
		let error;

		try {
			({ data, error } = await locals.supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${url.origin}/auth/callback`
				}
			}));
		} catch (error) {
			return fail(500, { error: formatSupabaseRequestError(error, 'signup'), email });
		}

		if (error) {
			return fail(400, { error: error.message, email });
		}

		if (data.session) {
			redirect(303, '/play');
		}

		return {
			success: 'Account created. Check your inbox if email confirmation is turned on in Supabase.',
			email
		};
	}
};
;null as any as Actions;