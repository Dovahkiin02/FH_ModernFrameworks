<script lang="ts">
	import { onMount } from 'svelte';
	import { setGameSession } from '$lib/game/context';
	import { GameSession } from '$lib/game/session.svelte';

	let { children, data } = $props();

	const session = new GameSession('guest');
	setGameSession(session);

	onMount(() => {
		session.userKey = data.user?.id ?? 'guest';
		session.hydrate();
	});
</script>

{@render children()}
