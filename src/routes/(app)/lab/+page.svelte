<script lang="ts">
	import { goto } from '$app/navigation';
	import ConfigPreview from '$lib/components/config/ConfigPreview.svelte';
	import PresetPicker from '$lib/components/config/PresetPicker.svelte';
	import RuleEditor from '$lib/components/config/RuleEditor.svelte';
	import StackTemplateEditor from '$lib/components/config/StackTemplateEditor.svelte';
	import { getGameSession } from '$lib/game/context';

	const session = getGameSession();

	async function startConfiguredRun() {
		if (session.state?.status === 'playing') {
			const shouldReplace = window.confirm(
				'A game is currently running. Starting a new one will replace the current run. Continue?'
			);

			if (!shouldReplace) return;
		}

		if (session.start()) {
			await goto('/play');
		}
	}
</script>

<section class="space-y-6">
	<div class="panel p-8">
		<p class="eyebrow">Rule Lab</p>
		<h1 class="mt-2 text-5xl font-black text-slate-900">Design The Table</h1>
		<p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
			This page edits the entire local ruleset: player names, deck size, stack geometry, and special reset rules.
		</p>

		{#if session.state?.status === 'playing'}
			<p class="mt-5 rounded-[18px] bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
				A run is currently active. Starting from this page will replace the current game.
			</p>
		{/if}
	</div>

	<PresetPicker {session} />
	<RuleEditor {session} />

	<section class="panel p-5">
		<p class="eyebrow">Players</p>
		<h2 class="mt-1 text-3xl font-black text-slate-900">Seat Names</h2>

		<div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each session.setup.playerNames as name, index}
				<label class="space-y-2">
					<span class="text-sm font-bold text-slate-700">Player {index + 1}</span>
					<input
						class="field-input"
						type="text"
						value={name}
						oninput={(event) => session.setPlayerName(index, (event.currentTarget as HTMLInputElement).value)}
					/>
				</label>
			{/each}
		</div>
	</section>

	<StackTemplateEditor {session} />
	<ConfigPreview {session} />

	<div class="flex flex-wrap gap-3">
		<button class="action-button" disabled={!session.validation.valid} onclick={startConfiguredRun} type="button">
			Start Run With These Rules
		</button>
		<a class="subtle-button inline-flex items-center justify-center" href="/play">Back To Play</a>
	</div>
</section>
