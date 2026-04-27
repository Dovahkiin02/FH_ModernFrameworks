import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.set('quiz-score', '0', { path: '/' });
	redirect(302, '/mpa/quiz/1');
};
