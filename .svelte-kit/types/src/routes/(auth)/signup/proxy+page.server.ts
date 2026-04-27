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

		const { data, error } = await locals.supabase.auth.signUp({ email, password });

		if (error) {
			return fail(400, { error: error.message, email });
		}

		if (data.session) {
			redirect(303, '/play');
		}

		return {
			success: 'Account created. If email confirmation is enabled in Supabase, check your inbox next.',
			email
		};
	}
};
;null as any as Actions;