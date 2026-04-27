<script lang="ts">
	let { data } = $props();
</script>

<h1 class="text-2xl font-bold mb-6">Quiz (MPA)</h1>

<div class="bg-green-50 border border-green-200 rounded-lg p-6">
	<h2 class="text-xl font-bold mb-2">Quiz Complete!</h2>
	<p class="text-lg">
		You scored <strong>{data.score}</strong> out of <strong>{data.total}</strong>.
	</p>
	<a
		href="/mpa/quiz"
		class="inline-block mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
	>
		Try Again
	</a>
</div>
