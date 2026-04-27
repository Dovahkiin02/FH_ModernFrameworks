<script lang="ts">
	let { session } = $props();
</script>

<section class="panel-strong p-5">
	<p class="eyebrow">Hints</p>
	<h2 class="mt-1 text-2xl font-black">Best Next Moves</h2>

	{#if !session.state || !session.state.config.hintsEnabled}
		<p class="mt-4 text-sm text-slate-600">Hints are disabled in this ruleset.</p>
	{:else if session.suggestedMoves.length === 0}
		<p class="mt-4 text-sm text-slate-600">No legal move is currently available.</p>
	{:else}
		<div class="mt-4 space-y-3">
			{#each session.suggestedMoves as move}
				<div class="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
					<p class="text-sm font-black text-slate-900">
						Play {move.card} on {move.stackLabel}
					</p>
					<p class="mt-1 text-sm text-slate-600">
						{move.kind === 'reset'
							? `Jump back by ${move.distance} on the ${move.stackDirection} stack.`
							: `A normal ${move.distance}-step ${move.stackDirection === 'up' ? 'increase' : 'decrease'}.`}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</section>
