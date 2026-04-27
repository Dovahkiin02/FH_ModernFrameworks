import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: questions, error } = await locals.supabase
		.from('quiz_questions')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Failed to load questions:', error);
		return { questions: [] };
	}

	return { questions: questions ?? [] };
};
