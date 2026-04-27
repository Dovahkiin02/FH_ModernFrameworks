<script lang="ts">
	import './layout.css';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AppShell user={data.user} supabaseConfigured={data.supabaseConfigured}>
	{@render children()}
</AppShell>
