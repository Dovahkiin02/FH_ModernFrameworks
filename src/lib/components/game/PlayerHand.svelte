<script lang="ts">
	import type { LegalMove } from '$lib/game/core/types';
	import type { GameSession } from '$lib/game/session.svelte';

	let { session, draggedCard, startDrag } = $props<{
		session: GameSession;
		draggedCard: number | null;
		startDrag: (card: number, event: PointerEvent) => void;
	}>();

	const playableCards = $derived(new Set(session.legalMoves.map((move: LegalMove) => move.card)));
</script>

{#if session.currentPlayer}
	<section class="panel-strong p-5">
		<div class="flex items-center justify-between gap-4">
			<div>
				<p class="eyebrow">Current Hand</p>
				<h2 class="text-2xl font-black">{session.currentPlayer.name}</h2>
			</div>
			<div class="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
				{session.currentPlayer.hand.length} cards
			</div>
		</div>

		<div class="mt-5 flex flex-wrap gap-3">
			{#each session.currentPlayer.hand as card}
				<div
					aria-disabled={!playableCards.has(card)}
					class={`rounded-[22px] border px-4 py-3 text-center shadow-sm transition ${
						playableCards.has(card)
							? 'cursor-grab border-emerald-300 bg-emerald-50 text-emerald-900 hover:-translate-y-0.5 hover:shadow-md'
							: 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 grayscale'
					} ${draggedCard === card ? 'scale-[0.97] opacity-55 shadow-none' : ''}`}
					data-card-value={card}
					data-testid={`card-${card}`}
					onpointerdown={(event) => playableCards.has(card) && startDrag(card, event)}
					role="button"
					tabindex={playableCards.has(card) ? 0 : -1}
				>
					<p class="text-2xl font-black">{card}</p>
				</div>
			{/each}
		</div>
	</section>
{/if}
