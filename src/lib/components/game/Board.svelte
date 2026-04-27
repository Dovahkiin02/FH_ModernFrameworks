<script lang="ts">
	import type { LegalMove } from '$lib/game/core/types';
	import type { GameSession } from '$lib/game/session.svelte';
	import StackPile from './StackPile.svelte';

	let { session, draggedCard, hoveredStackId, rejectedStackId, getDraggedMove, playDraggedCard, setHoveredStack } =
		$props<{
			session: GameSession;
			draggedCard: number | null;
			hoveredStackId: string | null;
			rejectedStackId: string | null;
			getDraggedMove: (stackId: string) => LegalMove | null;
			playDraggedCard: (stackId: string, card?: number | null) => void;
			setHoveredStack: (stackId: string | null) => void;
		}>();

	function stackOrderValue(label: string): number {
		const match = label.match(/(\d+)\s*$/);
		return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
	}

	function compareStacks(
		left: { label: string; id: string },
		right: { label: string; id: string }
	): number {
		const leftOrder = stackOrderValue(left.label);
		const rightOrder = stackOrderValue(right.label);

		if (leftOrder !== rightOrder) {
			return leftOrder - rightOrder;
		}

		return left.label.localeCompare(right.label) || left.id.localeCompare(right.id);
	}

	const ascendingStacks = $derived(
		session.state
			? [...session.state.stacks]
					.filter((stack) => stack.direction === 'up')
					.sort(compareStacks)
			: []
	);

	const descendingStacks = $derived(
		session.state
			? [...session.state.stacks]
					.filter((stack) => stack.direction === 'down')
					.sort(compareStacks)
			: []
	);
</script>

{#if session.state}
	<section class="table-surface rounded-[34px] p-5 text-white sm:p-6">
		<div class="mb-5 flex items-center justify-between gap-4">
			<div>
				<p class="eyebrow text-white/60">Middle Table</p>
				<h2 class="text-3xl font-black">Shared Stacks</h2>
			</div>
			<div class="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
				{session.state.history.length} cards placed
			</div>
		</div>

		<div class="grid gap-4 lg:grid-cols-2 lg:items-start">
			<div class="space-y-4">
				{#each ascendingStacks as stack}
					<StackPile
						{stack}
						draggedCard={draggedCard}
						draggedMove={getDraggedMove(stack.id)}
						isHovered={hoveredStackId === stack.id}
						isRejected={rejectedStackId === stack.id}
						onHover={() => setHoveredStack(stack.id)}
						onLeave={() => setHoveredStack(null)}
					/>
				{/each}
			</div>

			<div class="space-y-4">
				{#each descendingStacks as stack}
					<StackPile
						{stack}
						draggedCard={draggedCard}
						draggedMove={getDraggedMove(stack.id)}
						isHovered={hoveredStackId === stack.id}
						isRejected={rejectedStackId === stack.id}
						onHover={() => setHoveredStack(stack.id)}
						onLeave={() => setHoveredStack(null)}
					/>
				{/each}
			</div>
		</div>
	</section>
{/if}
