<script lang="ts">
	let { session } = $props();
</script>

<section class="panel p-5">
	<p class="eyebrow">Preview</p>
	<h2 class="mt-1 text-3xl font-black text-slate-900">Configuration Health</h2>

	<div class="mt-5 grid gap-4 md:grid-cols-3">
		<div class="rounded-[24px] bg-white p-4 shadow-sm">
			<p class="text-sm font-semibold text-slate-500">Deck Size</p>
			<p class="mt-1 text-3xl font-black text-slate-900">{session.deckSize}</p>
		</div>
		<div class="rounded-[24px] bg-white p-4 shadow-sm">
			<p class="text-sm font-semibold text-slate-500">Opening Cards Dealt</p>
			<p class="mt-1 text-3xl font-black text-slate-900">{session.openingCards}</p>
		</div>
		<div class="rounded-[24px] bg-white p-4 shadow-sm">
			<p class="text-sm font-semibold text-slate-500">Stacks</p>
			<p class="mt-1 text-3xl font-black text-slate-900">{session.setup.config.stackTemplates.length}</p>
		</div>
	</div>

	<div class="mt-5 rounded-[24px] border border-slate-200 bg-white p-4">
		{#if session.validation.valid}
			<p class="font-black text-emerald-700">This ruleset is ready to start.</p>
			<p class="mt-2 text-sm text-slate-600">
				The deck and opening hands line up, and the board has both ascending and descending stacks.
			</p>
		{:else}
			<p class="font-black text-rose-700">Fix these issues before starting a run.</p>
			<ul class="mt-3 space-y-2 text-sm text-slate-700">
				{#each session.validation.issues as issue}
					<li>• {issue}</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
