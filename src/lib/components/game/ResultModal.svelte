<script lang="ts">
	let { session } = $props();
</script>

{#if session.state && session.state.status !== 'playing'}
	<div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
		<div
			class={`panel max-w-xl p-8 ${session.state.status === 'won' ? 'border-amber-200/80 bg-[radial-gradient(circle_at_top,_rgba(255,244,196,0.92),_transparent_34%),linear-gradient(180deg,_rgba(255,252,244,0.98),_rgba(255,247,232,0.94))] shadow-[0_26px_80px_rgba(180,83,9,0.22)]' : ''}`}
		>
			{#if session.state.status === 'won'}
				<div class="mb-5 flex items-center justify-between gap-4">
					<div>
						<p class="eyebrow text-amber-800">Victory</p>
						<p class="mt-2 text-sm font-semibold text-amber-900/80">The table cleared the full deck.</p>
					</div>
					<div
						class="flex h-18 w-18 items-center justify-center rounded-full border border-amber-200 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.95),_rgba(255,233,163,0.98)_45%,_rgba(245,158,11,0.96)_100%)] text-3xl shadow-[0_12px_28px_rgba(245,158,11,0.28)]"
						aria-hidden="true"
					>
						✦
					</div>
				</div>
			{:else}
				<p class="eyebrow">Run Ended</p>
			{/if}
			<h2 class="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">
				{session.state.status === 'won' ? 'All Cards Cleared.' : 'No Legal Move Left.'}
			</h2>
			<p class="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
				{session.state.status === 'won'
					? 'Every card reached the middle stacks. The table won together.'
					: session.state.lossReason}
			</p>

			<div
				class={`mt-7 flex items-center justify-between gap-4 rounded-[28px] px-5 py-5 text-sm font-semibold text-slate-700 sm:px-6 ${
					session.state.status === 'won'
						? 'bg-[linear-gradient(135deg,_rgba(255,248,222,0.95),_rgba(255,239,194,0.92))] ring-1 ring-amber-200/70'
						: 'bg-slate-100/85 ring-1 ring-slate-200'
				}`}
			>
				<div>
					<p class="text-slate-500">{session.state.status === 'won' ? 'Winning Run' : 'Run Length'}</p>
					<p class="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">{session.state.turnNumber} turns</p>
				</div>
				{#if session.state.status === 'won'}
					<div
						class="rounded-full bg-white/65 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-amber-800 shadow-sm"
					>
						Full Deck Complete
					</div>
				{/if}
			</div>

			<div class="mt-7 flex flex-wrap gap-3">
				<button class="action-button min-w-40" onclick={() => session.start()} type="button">Play Again</button>
				<a class="subtle-button inline-flex min-w-40 items-center justify-center" href="/history">Open History</a>
				<a class="subtle-button inline-flex min-w-40 items-center justify-center" href="/lab">Adjust Rules</a>
			</div>
		</div>
	</div>
{/if}
