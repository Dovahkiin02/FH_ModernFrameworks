<script lang="ts">
	let { session } = $props();

	function updateNumber(field: 'playerCount' | 'handSize' | 'minCardsPerTurn' | 'deckMin' | 'deckMax', event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		session.setup.config[field] = Number(target.value);
		session.syncSetup();
	}

	function updateToggle(field: 'concealHandsBetweenTurns' | 'hintsEnabled', event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		session.setup.config[field] = target.checked;
		session.syncSetup();
	}
	
</script>

<section class="panel p-5">
	<p class="eyebrow">Core Rules</p>
	<h2 class="mt-1 text-3xl font-black text-slate-900">Table Configuration</h2>

	<div class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
		<label class="space-y-2">
			<span class="text-sm font-bold text-slate-700">Players</span>
			<input class="field-input" min="2" type="number" value={session.setup.config.playerCount} oninput={(event) => updateNumber('playerCount', event)} />
		</label>

		<label class="space-y-2">
			<span class="text-sm font-bold text-slate-700">Hand Size</span>
			<input class="field-input" min="1" type="number" value={session.setup.config.handSize} oninput={(event) => updateNumber('handSize', event)} />
		</label>

		<label class="space-y-2">
			<span class="text-sm font-bold text-slate-700">Minimum Plays</span>
			<input class="field-input" min="1" type="number" value={session.setup.config.minCardsPerTurn} oninput={(event) => updateNumber('minCardsPerTurn', event)} />
		</label>

		<label class="space-y-2">
			<span class="text-sm font-bold text-slate-700">Deck Minimum</span>
			<input class="field-input" type="number" value={session.setup.config.deckMin} oninput={(event) => updateNumber('deckMin', event)} />
		</label>

		<label class="space-y-2">
			<span class="text-sm font-bold text-slate-700">Deck Maximum</span>
			<input class="field-input" type="number" value={session.setup.config.deckMax} oninput={(event) => updateNumber('deckMax', event)} />
		</label>
	</div>

	<div class="mt-5 grid gap-4 md:grid-cols-2">
		<label class="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-4">
			<div>
				<p class="font-black text-slate-900">Conceal Hands Between Turns</p>
				<p class="mt-1 text-sm text-slate-600">Useful for hot-seat play on one shared device.</p>
			</div>
			<input checked={session.setup.config.concealHandsBetweenTurns} type="checkbox" onchange={(event) => updateToggle('concealHandsBetweenTurns', event)} />
		</label>

		<label class="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white px-4 py-4">
			<div>
				<p class="font-black text-slate-900">Enable Hints</p>
				<p class="mt-1 text-sm text-slate-600">Show low-risk moves based on distance and reset opportunities.</p>
			</div>
			<input checked={session.setup.config.hintsEnabled} type="checkbox" onchange={(event) => updateToggle('hintsEnabled', event)} />
		</label>
	</div>
</section>
