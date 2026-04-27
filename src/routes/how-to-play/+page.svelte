<section class="space-y-6">
	<div class="panel p-8">
		<p class="eyebrow">Rules Reference</p>
		<h1 class="mt-2 text-5xl font-black text-slate-900">How To Play</h1>
		<p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
			The table cooperates against the deck. Each turn belongs to exactly one player, but the success condition
			is shared by everyone.
		</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<section class="panel p-6">
			<h2 class="text-3xl font-black text-slate-900">Core Flow</h2>
			<ul class="mt-5 space-y-3 text-base leading-7 text-slate-700">
				<li>1. Each player starts with a hand. The remaining cards stay in a facedown draw pile.</li>
				<li>2. The board starts with ascending and descending stacks in the middle.</li>
				<li>3. On your turn, play at least the configured minimum number of cards.</li>
				<li>4. End your turn, refill up to the target hand size, and pass to the next player.</li>
				<li>5. The team wins when every card has been played.</li>
			</ul>
		</section>

		<section class="panel p-6">
			<h2 class="text-3xl font-black text-slate-900">Special Reset Rule</h2>
			<div class="mt-5 rounded-[24px] bg-amber-50 p-5 text-slate-800">
				<p class="font-black">Ascending example</p>
				<p class="mt-2 text-lg">22 → 12 is legal when the reset distance includes 10.</p>
			</div>
			<div class="mt-4 rounded-[24px] bg-white p-5 text-slate-800 shadow-sm">
				<p class="font-black">Descending example</p>
				<p class="mt-2 text-lg">68 → 78 is legal when the reset distance includes 10.</p>
			</div>
		</section>
	</div>

	<section class="panel p-6">
		<h2 class="text-3xl font-black text-slate-900">Configurable Values</h2>
		<p class="mt-4 max-w-3xl text-base leading-7 text-slate-600">
			The rule lab exposes player count, hand size, deck range, stack count, stack directions, starting values,
			and reset distances. That makes it easy to test variants like 20-card reset jumps or wider tables.
		</p>
	</section>
</section>
