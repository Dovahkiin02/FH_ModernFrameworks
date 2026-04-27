<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LegalMove } from '$lib/game/core/types';
	import { beginPointerDrag, endPointerDrag, updatePointerDrag } from '$lib/game/pointer-drag';
	import type { GameSession } from '$lib/game/session.svelte';
	import Board from './Board.svelte';
	import HintPanel from './HintPanel.svelte';
	import InterTurnOverlay from './InterTurnOverlay.svelte';
	import MoveLog from './MoveLog.svelte';
	import PlayerHand from './PlayerHand.svelte';
	import ResultModal from './ResultModal.svelte';
	import TurnPanel from './TurnPanel.svelte';

	let { session } = $props<{ session: GameSession }>();

	let draggedCard = $state<number | null>(null);
	let hoveredStackId = $state<string | null>(null);
	let rejectedStackId = $state<string | null>(null);
	let dragPointer = $state<{ x: number; y: number } | null>(null);
	let rejectionTimeout: ReturnType<typeof setTimeout> | null = null;
	let detachPointerListeners: (() => void) | null = null;

	const legalMoveLookup = $derived.by(() => {
		const lookup = new Map<string, LegalMove>();

		for (const move of session.legalMoves) {
			lookup.set(`${move.card}:${move.stackId}`, move);
		}

		return lookup;
	});

	function setDraggedCard(card: number | null) {
		draggedCard = card;
		hoveredStackId = null;
		dragPointer = null;

		if (card === null) {
			clearRejectedState();
		}
	}

	function getDraggedMove(stackId: string): LegalMove | null {
		if (draggedCard === null) return null;
		return legalMoveLookup.get(`${draggedCard}:${stackId}`) ?? null;
	}

	function setHoveredStack(stackId: string | null) {
		hoveredStackId = stackId;
	}

	function clearRejectedState() {
		if (rejectionTimeout) {
			clearTimeout(rejectionTimeout);
			rejectionTimeout = null;
		}

		rejectedStackId = null;
	}

	function findHoveredStackId(clientX: number, clientY: number): string | null {
		const target = document.elementFromPoint(clientX, clientY);
		const stackElement = target?.closest<HTMLElement>('[data-stack-id]');
		return stackElement?.dataset.stackId ?? null;
	}

	const pointerDragBindings = {
		clearRejectedState,
		setDraggedCard,
		setDragPointer: (pointer: { x: number; y: number } | null) => {
			dragPointer = pointer;
		},
		setHoveredStackId: (stackId: string | null) => {
			hoveredStackId = stackId;
		},
		findHoveredStackId,
		playDraggedCard
	};

	function rejectDrop(stackId: string) {
		clearRejectedState();
		rejectedStackId = stackId;
		rejectionTimeout = setTimeout(() => {
			rejectedStackId = null;
			rejectionTimeout = null;
		}, 380);
	}

	function playDraggedCard(stackId: string, card: number | null = draggedCard) {
		if (card === null) return;

		const move = legalMoveLookup.get(`${card}:${stackId}`) ?? null;
		if (!move) {
			rejectDrop(stackId);
			setDraggedCard(null);
			return;
		}

		session.play(stackId, card);
		setDraggedCard(null);
	}

	function stopPointerTracking() {
		detachPointerListeners?.();
		detachPointerListeners = null;
	}

	function finishDrag(clientX: number, clientY: number) {
		endPointerDrag(draggedCard, { clientX, clientY }, pointerDragBindings);
		stopPointerTracking();
	}

	function startPointerTracking() {
		stopPointerTracking();

		const handlePointerMove = (event: PointerEvent) => {
			updatePointerDrag({ clientX: event.clientX, clientY: event.clientY }, pointerDragBindings);
		};

		const handlePointerUp = (event: PointerEvent) => {
			finishDrag(event.clientX, event.clientY);
		};

		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp, { once: true });

		detachPointerListeners = () => {
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', handlePointerUp);
		};
	}

	function startDrag(card: number, event: PointerEvent) {
		event.preventDefault();
		beginPointerDrag(card, { clientX: event.clientX, clientY: event.clientY }, pointerDragBindings);
		startPointerTracking();
	}

	onDestroy(() => {
		stopPointerTracking();
		if (rejectionTimeout) {
			clearTimeout(rejectionTimeout);
		}
	});
</script>

<div class="grid gap-6 xl:grid-cols-[1.65fr_0.9fr]">
	<div class="space-y-6">
		<Board
			{session}
			{draggedCard}
			{hoveredStackId}
			{rejectedStackId}
			{getDraggedMove}
			{playDraggedCard}
			{setHoveredStack}
		/>
		<PlayerHand {session} {draggedCard} {startDrag} />
	</div>

	<div class="space-y-6">
		<TurnPanel {session} />
		<HintPanel {session} />
		<MoveLog {session} />
	</div>
</div>

{#if draggedCard !== null && dragPointer}
	<div
		class="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-[22px] border border-emerald-300 bg-emerald-50/95 px-5 py-3 text-2xl font-black text-emerald-900 shadow-2xl"
		style={`left:${dragPointer.x}px; top:${dragPointer.y}px;`}
	>
		{draggedCard}
	</div>
{/if}

<InterTurnOverlay {session} />
<ResultModal {session} />
