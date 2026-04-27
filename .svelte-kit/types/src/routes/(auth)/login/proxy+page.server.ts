// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { SUPABASE_CONFIG_ERROR } from '$lib/supabase/config';
import type { Actions, PageServerLoad } from './$types';

export const load = async ({ parent }: Parameters<PageServerLoad>[0]) => {
	const { user } = await parent();
	if (user) {
		redirect(303, '/play');
	}
};

export const actions = {
	default: async ({ request, locals }: import('./$types').RequestEvent) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');

		if (!locals.supabase) {
			return fail(503, { error: SUPABASE_CONFIG_ERROR, email });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { error: error.message, email });
		}

		redirect(303, '/play');
	}
};
;null as any as Actions;