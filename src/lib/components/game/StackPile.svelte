<script lang="ts">
	import type { LegalMove } from '$lib/game/core/types';

	let { stack, draggedCard, draggedMove, isHovered, isRejected, onHover, onLeave } = $props<{
		stack: {
			id: string;
			label: string;
			direction: 'up' | 'down';
			startValue: number;
			allowedResetDistances: number[];
			playedCards: number[];
			topCard: number;
		};
		draggedCard: number | null;
		draggedMove: LegalMove | null;
		isHovered: boolean;
		isRejected: boolean;
		onHover: () => void;
		onLeave: () => void;
	}>();

	const isAscending = $derived(stack.direction === 'up');
	const hasDraggedCard = $derived(draggedCard !== null);
	const isLegalTarget = $derived(Boolean(draggedMove));
</script>

<section
	aria-label={`${stack.label} stack`}
	class={`rounded-[28px] border p-4 text-white shadow-xl backdrop-blur-sm transition duration-150 ${
		isAscending
			? 'border-emerald-300/30 bg-[linear-gradient(135deg,rgba(18,97,89,0.86),rgba(14,67,78,0.92))]'
			: 'border-amber-300/28 bg-[linear-gradient(135deg,rgba(91,88,45,0.84),rgba(52,75,63,0.9))]'
	} ${hasDraggedCard && !isLegalTarget ? 'opacity-85 saturate-[0.78]' : ''} ${
		isHovered && isLegalTarget ? 'ring-4 ring-emerald-300/60 scale-[1.01]' : ''
	} ${isHovered && hasDraggedCard && !isLegalTarget ? 'bg-slate-700/45 ring-4 ring-slate-300/35' : ''} ${
		isRejected ? 'shake-drop ring-4 ring-rose-300/55' : ''
	}`}
	data-stack-id={stack.id}
	data-testid={`stack-${stack.id}`}
	onpointerenter={() => onHover()}
	onpointerleave={() => onLeave()}
	role="group"
>
	<div class="flex items-start justify-between gap-4">
		<div class="flex items-center gap-3">
			<div
				class={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-black ${
					isAscending ? 'bg-emerald-300/20 text-emerald-100' : 'bg-amber-300/20 text-amber-100'
				}`}
			>
				{isAscending ? '↑' : '↓'}
			</div>
			<div>
				<h3 class="text-2xl font-black">{stack.label}</h3>
			</div>
		</div>
		<div class="rounded-[22px] bg-white/90 px-4 py-3 text-right text-slate-900 shadow-lg">
			<p class="text-3xl font-black">{stack.topCard}</p>
		</div>
	</div>
</section>
