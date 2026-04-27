import { redirect } from '@sveltejs/kit';
import {
	getQuestion,
	getShuffledAnswers,
	getTotalQuestions,
	checkAnswer
} from '$lib/server/quiz-service';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const index = parseInt(params.index) - 1;
	const total = getTotalQuestions();

	if (isNaN(index) || index < 0 || index >= total) {
		redirect(302, '/mpa/quiz/1');
	}

	const question = getQuestion(index)!;
	const answers = getShuffledAnswers(index);
	const score = parseInt(cookies.get('quiz-score') ?? '0');

	return {
		index,
		number: index + 1,
		total,
		question: question.question,
		answers,
		score
	};
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const index = parseInt(params.index) - 1;
		const total = getTotalQuestions();
		const data = await request.formData();
		const answer = data.get('answer') as string;

		const correct = checkAnswer(index, answer);
		const score = parseInt(cookies.get('quiz-score') ?? '0');
		const newScore = correct ? score + 1 : score;

		cookies.set('quiz-score', String(newScore), { path: '/' });

		if (index + 1 >= total) {
			redirect(303, '/mpa/quiz/done');
		}

		redirect(303, `/mpa/quiz/${index + 2}`);
	}
};
