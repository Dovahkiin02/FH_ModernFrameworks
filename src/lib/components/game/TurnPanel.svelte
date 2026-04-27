<script lang="ts">
	let { session } = $props();
</script>

{#if session.state && session.currentPlayer}
	<section class="panel-strong p-5">
		<p class="eyebrow">Turn Status</p>
		<h2 class="mt-1 text-2xl font-black">Turn {session.state.turnNumber}</h2>

		<div class="mt-4 space-y-3 text-sm text-slate-700">
			<div class="flex items-center justify-between gap-4">
				<span class="font-semibold">Player</span>
				<span class="font-black">{session.currentPlayer.name}</span>
			</div>
			<div class="flex items-center justify-between gap-4">
				<span class="font-semibold">Moves this turn</span>
				<span class="font-black">
					{session.state.movesThisTurn} / {session.state.config.minCardsPerTurn}
				</span>
			</div>
			<div class="flex items-center justify-between gap-4">
				<span class="font-semibold">Draw pile</span>
				<span class="font-black">{session.state.drawPile.length}</span>
			</div>
			<div class="flex items-center justify-between gap-4">
				<span class="font-semibold">Progress</span>
				<span class="font-black">{session.progressPercent}%</span>
			</div>
		</div>

		<div class="mt-5 flex flex-wrap gap-3">
			<button class="action-button" disabled={!session.canEndTurn} onclick={() => session.endCurrentTurn()} type="button">
				End Turn
			</button>
			<button class="subtle-button" onclick={() => session.abandonActiveGame()} type="button">
				Abandon Run
			</button>
		</div>
	</section>
{/if}
