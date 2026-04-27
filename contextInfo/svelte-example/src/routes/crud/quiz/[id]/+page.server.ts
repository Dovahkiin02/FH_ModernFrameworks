import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { data: question, error: err } = await locals.supabase
		.from('quiz_questions')
		.select('*')
		.eq('id', params.id)
		.single();

	if (err || !question) {
		error(404, 'Question not found');
	}

	return { question };
};

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		const formData = await request.formData();
		const question = formData.get('question') as string;
		const correct = formData.get('correct') as string;
		const wrong1 = formData.get('wrong1') as string;
		const wrong2 = formData.get('wrong2') as string;
		const wrong3 = formData.get('wrong3') as string;

		if (!question || !correct || !wrong1 || !wrong2 || !wrong3) {
			return fail(400, { error: 'All fields are required' });
		}

		const { error: err } = await locals.supabase
			.from('quiz_questions')
			.update({ question, correct, wrong: [wrong1, wrong2, wrong3] })
			.eq('id', params.id);

		if (err) {
			return fail(500, { error: err.message });
		}

		redirect(303, '/crud/quiz');
	},

	delete: async ({ params, locals }) => {
		const { error: err } = await locals.supabase
			.from('quiz_questions')
			.delete()
			.eq('id', params.id);

		if (err) {
			return fail(500, { error: err.message });
		}

		redirect(303, '/crud/quiz');
	}
};
