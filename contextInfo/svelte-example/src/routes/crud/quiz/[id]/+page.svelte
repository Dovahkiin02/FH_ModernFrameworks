<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<h1 class="text-2xl font-bold mb-6">Edit Question</h1>

{#if form?.error}
	<p class="text-red-600 mb-4">{form.error}</p>
{/if}

<form method="POST" action="?/update" use:enhance class="flex flex-col gap-4 max-w-lg">
	<label class="flex flex-col gap-1">
		Question
		<textarea name="question" required rows="3" class="border rounded p-2"
			>{data.question.question}</textarea>
	</label>
	<label class="flex flex-col gap-1">
		Correct answer
		<input type="text" name="correct" required value={data.question.correct} class="border rounded p-2" />
	</label>
	<label class="flex flex-col gap-1">
		Wrong answer 1
		<input type="text" name="wrong1" required value={data.question.wrong[0]} class="border rounded p-2" />
	</label>
	<label class="flex flex-col gap-1">
		Wrong answer 2
		<input type="text" name="wrong2" required value={data.question.wrong[1]} class="border rounded p-2" />
	</label>
	<label class="flex flex-col gap-1">
		Wrong answer 3
		<input type="text" name="wrong3" required value={data.question.wrong[2]} class="border rounded p-2" />
	</label>
	<div class="flex gap-3">
		<button type="submit" class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
			Save
		</button>
		<a href="/crud/quiz" class="border rounded px-4 py-2 hover:bg-gray-50">Cancel</a>
	</div>
</form>

<form method="POST" action="?/delete" use:enhance class="mt-6">
	<button type="submit" class="text-red-600 hover:underline text-sm">
		Delete this question
	</button>
</form>
