<script lang="ts">
	import TopNav from './TopNav.svelte';

	let { user, supabaseConfigured, children } = $props();
</script>

<div class="min-h-screen">
	<TopNav {user} {supabaseConfigured} />

	<main class="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>
