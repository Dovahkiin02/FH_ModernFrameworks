<script lang="ts">
	let { session } = $props();
</script>

{#if session.handoffVisible}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
		<div class="panel max-w-lg p-8 text-center">
			<p class="eyebrow">Hot-Seat Handoff</p>
			<h2 class="mt-2 text-4xl font-black text-slate-900">Pass The Device</h2>
			<p class="mt-4 text-base text-slate-600">
				The next turn belongs to <span class="font-black text-slate-900">{session.nextPlayerName}</span>.
				Let everyone else look away before revealing the next hand.
			</p>
			<button class="action-button mt-6" onclick={() => session.revealNextHand()} type="button">
				Reveal Next Hand
			</button>
		</div>
	</div>
{/if}
