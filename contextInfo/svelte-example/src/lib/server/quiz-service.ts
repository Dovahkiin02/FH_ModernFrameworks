export type Question = {
	question: string;
	correct: string;
	wrong: string[];
};

const questions: Question[] = [
	{
		question: 'What HTML element should you use for a clickable action that does NOT navigate?',
		correct: '<button>',
		wrong: ['<a>', '<div onclick>', '<span>']
	},
	{
		question: 'In SvelteKit, which file exports a load() function that runs on the server?',
		correct: '+page.server.ts',
		wrong: ['+page.ts', '+server.ts', '+layout.svelte']
	},
	{
		question: 'Which CSS unit is relative to the font-size of the root element?',
		correct: 'rem',
		wrong: ['em', 'px', 'vh']
	},
	{
		question: 'What does the Svelte rune $derived do?',
		correct: 'Computes a value that updates when its dependencies change',
		wrong: [
			'Declares a reactive variable',
			'Runs a side effect',
			'Binds an input to a variable'
		]
	},
	{
		question: 'Which HTTP method is used to retrieve data from a server?',
		correct: 'GET',
		wrong: ['POST', 'PUT', 'DELETE']
	},
	{
		question: 'In Tailwind CSS, what does the class "flex-1" do?',
		correct: 'Makes the element grow to fill available space',
		wrong: [
			'Sets display to flex',
			'Adds a 1px gap between flex items',
			'Sets flex-direction to column'
		]
	},
	{
		question: 'What file extension enables runes outside of .svelte components?',
		correct: '.svelte.ts',
		wrong: ['.rune.ts', '.reactive.ts', '.state.ts']
	},
	{
		question: 'Which Svelte 5 rune replaces "export let" for component props?',
		correct: '$props()',
		wrong: ['$state()', '$derived()', '$bindable()']
	}
];

function shuffle<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export function getQuestions(): Question[] {
	return questions;
}

export function getQuestion(index: number): Question | undefined {
	return questions[index];
}

export function getShuffledAnswers(index: number): string[] {
	const q = questions[index];
	if (!q) return [];
	return shuffle([q.correct, ...q.wrong]);
}

export function checkAnswer(index: number, answer: string): boolean {
	const q = questions[index];
	if (!q) return false;
	return answer === q.correct;
}

export function getTotalQuestions(): number {
	return questions.length;
}
