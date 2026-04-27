export type QuizQuestion = {
	question: string;
	correct: string;
	answers: string[];
};

export class QuizStore {
	questions = $state<QuizQuestion[]>([]);
	currentIndex = $state(0);
	answers = $state<(string | null)[]>([]);
	loading = $state(true);
	error = $state<string | null>(null);

	get currentQuestion(): QuizQuestion | undefined {
		return this.questions[this.currentIndex];
	}

	get correctCount(): number {
		return this.answers.reduce<number>((count, answer, i) => {
			if (answer === this.questions[i]?.correct) return count + 1;
			return count;
		}, 0);
	}

	get progress(): string {
		if (this.questions.length === 0) return '';
		return `${this.currentIndex + 1} / ${this.questions.length}`;
	}

	get isComplete(): boolean {
		return this.questions.length > 0 && this.currentIndex >= this.questions.length;
	}

	submitAnswer(answer: string) {
		this.answers[this.currentIndex] = answer;
		this.currentIndex++;
	}

	reset() {
		this.currentIndex = 0;
		this.answers = [];
	}

	async load() {
		this.loading = true;
		this.error = null;
		try {
			const res = await fetch('/api/questions');
			if (!res.ok) throw new Error('Failed to load questions');
			this.questions = await res.json();
			this.answers = new Array(this.questions.length).fill(null);
			this.currentIndex = 0;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			this.loading = false;
		}
	}
}
