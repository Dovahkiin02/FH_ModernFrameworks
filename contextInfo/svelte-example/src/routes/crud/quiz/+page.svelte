<script lang="ts">
	let { data } = $props();
</script>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-2xl font-bold">Quiz Questions</h1>
	<a href="/crud/quiz/create" class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
		+ New Question
	</a>
</div>

{#if data.questions.length === 0}
	<p class="text-gray-500">No questions yet. Create one!</p>
{:else}
	<ul class="flex flex-col gap-3">
		{#each data.questions as question}
			<li class="border rounded p-4 hover:bg-gray-50">
				<a href="/crud/quiz/{question.id}" class="block">
					<p class="font-medium">{question.question}</p>
					<p class="text-sm text-green-700 mt-1">Answer: {question.correct}</p>
					<p class="text-xs text-gray-400 mt-1">
						{new Date(question.created_at).toLocaleDateString()}
					</p>
				</a>
			</li>
		{/each}
	</ul>
{/if}
