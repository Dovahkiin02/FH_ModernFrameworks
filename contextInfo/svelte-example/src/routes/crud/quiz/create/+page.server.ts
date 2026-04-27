import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const question = formData.get('question') as string;
		const correct = formData.get('correct') as string;
		const wrong1 = formData.get('wrong1') as string;
		const wrong2 = formData.get('wrong2') as string;
		const wrong3 = formData.get('wrong3') as string;

		if (!question || !correct || !wrong1 || !wrong2 || !wrong3) {
			return fail(400, { error: 'All fields are required' });
		}

		const { error } = await locals.supabase
			.from('quiz_questions')
			.insert({ question, correct, wrong: [wrong1, wrong2, wrong3] });

		if (error) {
			return fail(500, { error: error.message });
		}

		redirect(303, '/crud/quiz');
	}
};
