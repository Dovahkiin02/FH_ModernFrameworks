import { getTotalQuestions } from '$lib/server/quiz-service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const score = parseInt(cookies.get('quiz-score') ?? '0');
	const total = getTotalQuestions();

	return { score, total };
};
