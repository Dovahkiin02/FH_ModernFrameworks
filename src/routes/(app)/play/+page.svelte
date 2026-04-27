<script lang="ts">
	import GameScreen from '$lib/components/game/GameScreen.svelte';
	import { getGameSession } from '$lib/game/context';

	const session = getGameSession();
</script>

{#if session.state}
	<section class="mb-6 panel p-5">
		<p class="eyebrow">Active Run</p>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<h1 class="mt-1 text-4xl font-black text-slate-900">Play Area</h1>
				<p class="mt-3 text-base text-slate-600">
					Use the middle stacks to choose a destination, then play one of the currently legal cards from the active hand.
				</p>
			</div>

			<div
				class={`inline-flex rounded-full px-4 py-2 text-sm font-black ${
					session.state.status === 'won'
						? 'bg-emerald-100 text-emerald-800'
						: session.state.status === 'lost'
							? 'bg-rose-100 text-rose-800'
							: 'bg-amber-100 text-amber-900'
				}`}
			>
				{session.state.status === 'won'
					? 'Win'
					: session.state.status === 'lost'
						? 'Loss'
						: `Turn ${session.state.turnNumber}`}
			</div>
		</div>
	</section>

	<GameScreen {session} />
{:else}
	<section class="panel p-8">
		<p class="eyebrow">No Active Run</p>
		<h1 class="mt-2 text-5xl font-black text-slate-900">Start A New Game</h1>
		<p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
			Your current setup uses {session.setup.config.playerCount} players, {session.setup.config.handSize} cards per
			hand, and {session.setup.config.stackTemplates.length} middle stacks.
		</p>

		<div class="mt-8 flex flex-wrap gap-3">
			<button class="action-button" onclick={() => session.start()} type="button">
				Start With Current Rules
			</button>
			<a class="subtle-button inline-flex items-center justify-center" href="/lab">Open Rule Lab</a>
		</div>
	</section>
{/if}
