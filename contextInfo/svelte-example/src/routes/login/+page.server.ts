import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { error: error.message });
		}

		redirect(303, '/crud/quiz');
	},

	github: async ({ locals }) => {
		const { data, error } = await locals.supabase.auth.signInWithOAuth({
			provider: 'github',
			options: { redirectTo: 'http://localhost:5173/auth/callback' }
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		if (data.url) redirect(303, data.url);
	}
};
