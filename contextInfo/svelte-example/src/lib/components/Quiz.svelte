<script lang="ts">
	type Question = {
		question: string;
		correct: string;
		answers: string[];
	};

	let questions = $state<Question[]>([]);
	let currentIndex = $state(0);
	let userAnswers = $state<(string | null)[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let selected = $state<string | null>(null);

	let currentQuestion = $derived(questions[currentIndex]);
	let correctCount = $derived(
		userAnswers.reduce<number>((n, a, i) => (a === questions[i]?.correct ? n + 1 : n), 0)
	);
	let progress = $derived(questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : '');
	let isComplete = $derived(questions.length > 0 && currentIndex >= questions.length);

	$effect(() => {
		loadQuestions();
	});

	async function loadQuestions() {
		loading = true;
		error = null;
		try {
			const res = await fetch('/api/questions');
			if (!res.ok) throw new Error('Failed to load questions');
			questions = await res.json();
			userAnswers = new Array(questions.length).fill(null);
			currentIndex = 0;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			loading = false;
		}
	}

	function submit() {
		if (selected) {
			userAnswers[currentIndex] = selected;
			currentIndex++;
			selected = null;
		}
	}

	function reset() {
		currentIndex = 0;
		userAnswers = [];
		selected = null;
	}
</script>

<h1 class="text-2xl font-bold mb-6">Quiz (SPA)</h1>

{#if loading}
	<p class="text-gray-500">Loading questions...</p>
{:else if error}
	<p class="text-red-600">Error: {error}</p>
{:else if isComplete}
	<div class="bg-green-50 border border-green-200 rounded-lg p-6">
		<h2 class="text-xl font-bold mb-2">Quiz Complete!</h2>
		<p class="text-lg">
			You scored <strong>{correctCount}</strong> out of <strong>{questions.length}</strong>.
		</p>
		<button
			onclick={reset}
			class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			Try Again
		</button>
	</div>
{:else if currentQuestion}
	<p class="text-sm text-gray-500 mb-4">
		Question {progress} — Score: {correctCount}
	</p>

	<p class="text-lg font-medium mb-4">{currentQuestion.question}</p>

	<fieldset class="space-y-2 mb-4">
		{#each currentQuestion.answers as answer}
			<label class="flex items-center gap-3 rounded border p-3 hover:bg-gray-50 cursor-pointer">
				<input type="radio" bind:group={selected} value={answer} />
				<span>{answer}</span>
			</label>
		{/each}
	</fieldset>

	<button
		onclick={submit}
		disabled={!selected}
		class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
	>
		Submit Answer
	</button>
{/if}
