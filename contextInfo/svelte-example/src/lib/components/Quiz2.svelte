<script lang="ts">
	import { QuizStore } from '$lib/quiz-store.svelte';


	const quiz = new QuizStore();

	let selected = $state<string | null>(null);

	$effect(() => {
		quiz.load();
	});

	function submit() {
		if (selected) {
			quiz.submitAnswer(selected);
			selected = null;
		}
	}

	function reset() {
		quiz.reset();
		selected = null;
	}
</script>


<h1 class="text-2xl font-bold mb-6">Quiz (SPA)</h1>

{#if quiz.loading}
	{@render loading()}
{:else if quiz.error}
	{@render error(quiz.error)}
{:else if quiz.isComplete}
	{@render done(quiz.correctCount, quiz.questions.length)}
{:else if quiz.currentQuestion}
	{@render question(quiz.currentQuestion.question, quiz.currentQuestion.answers, quiz.progress, quiz.correctCount)}
{/if}


{#snippet loading()}
	<p class="text-gray-500">Loading questions...</p>
{/snippet}

{#snippet error(message: string)}
	<p class="text-red-600">Error: {message}</p>
{/snippet}

{#snippet done(score: number, total: number)}
	<div class="bg-green-50 border border-green-200 rounded-lg p-6">
		<h2 class="text-xl font-bold mb-2">Quiz Complete!</h2>
		<p class="text-lg">
			You scored <strong>{score}</strong> out of <strong>{total}</strong>.
		</p>
		<button
			onclick={reset}
			class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			Try Again
		</button>
	</div>
{/snippet}

{#snippet question(text: string, answers: string[], progress: string, score: number)}
	<p class="text-sm text-gray-500 mb-4">
		Question {progress} — Score: {score}
	</p>

	<p class="text-lg font-medium mb-4">{text}</p>

	<fieldset class="space-y-2 mb-4">
		{#each answers as answer}
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
{/snippet}

