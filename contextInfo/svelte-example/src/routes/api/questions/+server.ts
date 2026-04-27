import { json } from '@sveltejs/kit';
import { getQuestions } from '$lib/server/quiz-service';
import type { RequestHandler } from './$types';

function shuffle<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export const GET: RequestHandler = async () => {
	const questions = getQuestions();

	const payload = questions.map((q) => ({
		question: q.question,
		correct: q.correct,
		answers: shuffle([q.correct, ...q.wrong])
	}));

	return json(payload);
};
