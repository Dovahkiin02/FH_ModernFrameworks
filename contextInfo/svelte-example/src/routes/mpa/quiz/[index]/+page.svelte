<script lang="ts">
	let { data } = $props();
</script>

<h1 class="text-2xl font-bold mb-6">Quiz (MPA)</h1>

<p class="text-sm text-gray-500 mb-4">
	Question {data.number} of {data.total} — Score: {data.score}
</p>

<p class="text-lg font-medium mb-4">{data.question}</p>

<form method="POST">
	<fieldset class="space-y-2 mb-4">
		{#each data.answers as answer}
			<label class="flex items-center gap-3 rounded border p-3 hover:bg-gray-50 cursor-pointer">
				<input type="radio" name="answer" value={answer} required />
				<span>{answer}</span>
			</label>
		{/each}
	</fieldset>

	<button
		type="submit"
		class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
	>
		Submit Answer
	</button>
</form>
