<script lang="ts">
	import { PRESETS } from '$lib/game/core/presets';

	let { session } = $props();
</script>

<section class="panel p-5">
	<p class="eyebrow">Preset Library</p>
	<h2 class="mt-1 text-3xl font-black text-slate-900">Starting Points</h2>

	<div class="mt-5 grid gap-4 lg:grid-cols-3">
		{#each PRESETS as preset}
			<button
				class={`rounded-[26px] border p-5 text-left transition ${
					session.setup.presetId === preset.id
						? 'border-amber-300 bg-amber-50 shadow-lg'
						: 'border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-lg'
				}`}
				onclick={() => session.selectPreset(preset.id)}
				type="button"
			>
				<p class="eyebrow">{preset.id}</p>
				<h3 class="mt-2 text-2xl font-black text-slate-900">{preset.name}</h3>
				<p class="mt-3 text-sm leading-6 text-slate-600">{preset.description}</p>
			</button>
		{/each}
	</div>
</section>
