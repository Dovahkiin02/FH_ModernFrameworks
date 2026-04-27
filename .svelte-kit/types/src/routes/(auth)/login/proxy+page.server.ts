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
	submit: async ({ request, locals }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!locals.supabase) {
			return fail(503, { error: SUPABASE_CONFIG_ERROR, email });
		}

		let error;

		try {
			({ error } = await locals.supabase.auth.signInWithPassword({ email, password }));
		} catch (error) {
			return fail(500, { error: formatSupabaseRequestError(error, 'login'), email });
		}

		if (error) {
			return fail(400, { error: error.message, email });
		}

		redirect(303, '/play');
	}
};
;null as any as Actions;