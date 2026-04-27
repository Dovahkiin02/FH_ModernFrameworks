<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="bg-gray-900 text-white px-6 py-4 flex items-center gap-6">
	<a href="/" class="hover:text-gray-300">Home</a>
	<a href="/mpa/quiz" class="hover:text-gray-300">Quiz (MPA)</a>
	<a href="/spa/quiz" class="hover:text-gray-300">Quiz (SPA)</a>
	<a href="/spa/quiz2" class="hover:text-gray-300">Quiz (Snippets)</a>
	<a href="/crud/quiz" class="hover:text-gray-300">Quiz (CRUD)</a>
	<div class="ml-auto">
		{#if data.user}
			<span class="text-gray-400 text-sm mr-3">{data.user.email}</span>
			<form method="POST" action="/logout" class="inline">
				<button class="hover:text-gray-300 text-sm">Logout</button>
			</form>
		{:else}
			<a href="/login" class="hover:text-gray-300">Login</a>
		{/if}
	</div>
</nav>

<main class="max-w-2xl mx-auto px-4 py-8">
	{@render children()}
</main>
