<script lang="ts">
	let { form, data } = $props();
</script>

<div class="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
	<section class="panel p-8">
		<p class="eyebrow">Return To The Table</p>
		<h1 class="mt-2 text-5xl font-black text-slate-900">Log In</h1>
		<p class="mt-4 max-w-xl text-lg leading-8 text-slate-600">
			Sign in to unlock play, rule presets, and local run history tied to your account on this device.
		</p>
	</section>

	<section class="panel-strong p-8">
		{#if !data.supabaseConfigured}
			<p class="mb-4 rounded-[18px] bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
				Supabase is not configured yet. Create a `.env` file from `.env.example` and fill in your project values first.
			</p>
		{/if}

		<form action="?/submit" autocomplete="on" class="space-y-4" data-1p-ignore data-lpignore="true" method="POST">
			<label class="block space-y-2">
				<span class="text-sm font-bold text-slate-700">Email</span>
				<input
					autocomplete="email"
					autocapitalize="none"
					class="field-input"
					id="login-email"
					inputmode="email"
					name="email"
					required
					spellcheck="false"
					type="email"
					value={form?.email ?? ''}
				/>
			</label>

			<label class="block space-y-2">
				<span class="text-sm font-bold text-slate-700">Password</span>
				<input
					autocomplete="current-password"
					class="field-input"
					id="login-password"
					minlength="6"
					name="password"
					required
					type="password"
				/>
			</label>

			{#if form?.error}
				<p class="rounded-[18px] bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
					{form.error}
				</p>
			{/if}

			<button class="action-button w-full justify-center" disabled={!data.supabaseConfigured} type="submit">Enter Play Area</button>
		</form>

		<p class="mt-4 text-sm text-slate-600">
			Need an account? <a class="font-bold text-amber-700" href="/signup">Create one here.</a>
		</p>
	</section>
</div>
