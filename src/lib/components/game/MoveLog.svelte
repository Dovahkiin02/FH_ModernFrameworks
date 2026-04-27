<script lang="ts">
	let { session } = $props();

	const recentMoves = $derived(session.state ? [...session.state.history].slice(-8).reverse() : []);
</script>

<section class="panel-strong p-5">
	<p class="eyebrow">Move Log</p>
	<h2 class="mt-1 text-2xl font-black">Latest Plays</h2>

	{#if recentMoves.length === 0}
		<p class="mt-4 text-sm text-slate-600">No cards have been played yet.</p>
	{:else}
		<div class="mt-4 space-y-3">
			{#each recentMoves as move}
				<div class="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
					<p class="text-sm font-black text-slate-900">
						{move.playerName} played {move.card} on {move.stackLabel}
					</p>
					<p class="mt-1 text-sm text-slate-600">
						{move.kind === 'reset' ? `Reset by ${move.distance}.` : `Moved by ${move.distance}.`}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</section>
