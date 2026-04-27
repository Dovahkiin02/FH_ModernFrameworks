<script lang="ts">
	let { session } = $props();

	function updateStackLabel(index: number, event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		session.setup.config.stackTemplates[index].label = target.value;
		session.syncSetup();
	}

	function updateStackDirection(index: number, event: Event) {
		const target = event.currentTarget as HTMLSelectElement;
		session.setup.config.stackTemplates[index].direction = target.value as 'up' | 'down';
		session.syncSetup();
	}

	function updateStackStartValue(index: number, event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		session.setup.config.stackTemplates[index].startValue = Number(target.value);
		session.syncSetup();
	}

	function updateResetDistances(index: number, event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		session.setup.config.stackTemplates[index].allowedResetDistances = target.value
			.split(',')
			.map((value) => Number(value.trim()))
			.filter((value) => Number.isFinite(value) && value > 0);
		session.syncSetup();
	}
</script>

<section class="panel p-5">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<p class="eyebrow">Middle Stacks</p>
			<h2 class="mt-1 text-3xl font-black text-slate-900">Stack Templates</h2>
		</div>

		<div class="flex flex-wrap gap-3">
			<button class="subtle-button" onclick={() => session.addStack('up')} type="button">Add Ascending</button>
			<button class="subtle-button" onclick={() => session.addStack('down')} type="button">Add Descending</button>
		</div>
	</div>

	<div class="mt-5 space-y-4">
		{#each session.setup.config.stackTemplates as stack, index}
			<div class="rounded-[26px] border border-slate-200 bg-white p-4">
				<div class="grid gap-4 md:grid-cols-[1.3fr_0.9fr_0.8fr_1.2fr_auto]">
					<label class="space-y-2">
						<span class="text-sm font-bold text-slate-700">Label</span>
						<input class="field-input" type="text" value={stack.label} oninput={(event) => updateStackLabel(index, event)} />
					</label>

					<label class="space-y-2">
						<span class="text-sm font-bold text-slate-700">Direction</span>
						<select class="field-input" value={stack.direction} onchange={(event) => updateStackDirection(index, event)}>
							<option value="up">Ascending</option>
							<option value="down">Descending</option>
						</select>
					</label>

					<label class="space-y-2">
						<span class="text-sm font-bold text-slate-700">Start Value</span>
						<input class="field-input" type="number" value={stack.startValue} oninput={(event) => updateStackStartValue(index, event)} />
					</label>

					<label class="space-y-2">
						<span class="text-sm font-bold text-slate-700">Reset Distances</span>
						<input
							class="field-input"
							placeholder="10, 20"
							type="text"
							value={stack.allowedResetDistances.join(', ')}
							onchange={(event) => updateResetDistances(index, event)}
						/>
					</label>

					<div class="flex items-end">
						<button class="subtle-button w-full" onclick={() => session.removeStack(index)} type="button">
							Remove
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
