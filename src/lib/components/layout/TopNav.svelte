<script lang="ts">
	let { user, supabaseConfigured } = $props();

	const publicLinks = [
		{ href: '/', label: 'Overview' },
		{ href: '/how-to-play', label: 'How To Play' }
	];

	const appLinks = [
		{ href: '/play', label: 'Play' },
		{ href: '/lab', label: 'Rule Lab' },
		{ href: '/history', label: 'History' }
	];
</script>

<header class="panel mx-auto mt-4 max-w-7xl px-5 py-4 sm:px-6">
	<div class="flex flex-col gap-4 lg:flex-row lg:items-center">
		<div class="flex items-center gap-3">
			<a href="/" class="flex items-center gap-3">
				<div class="table-surface flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg">
					TG
				</div>
				<div>
					<p class="eyebrow">Co-op Card Play</p>
					<p class="text-xl font-black tracking-tight text-slate-900">theGame</p>
				</div>
			</a>
		</div>

		<nav class="flex flex-wrap items-center gap-2 lg:ml-10">
			{#each publicLinks as link}
				<a class="subtle-button text-sm text-slate-700 transition hover:bg-white" href={link.href}>
					{link.label}
				</a>
			{/each}

			{#if user}
				{#each appLinks as link}
					<a class="subtle-button text-sm text-slate-700 transition hover:bg-white" href={link.href}>
						{link.label}
					</a>
				{/each}
			{/if}
		</nav>

		<div class="flex flex-wrap items-center gap-3 lg:ml-auto">
			{#if user}
				<div class="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-slate-700">
					{user.email}
				</div>
				<form action="/logout" method="POST">
					<button class="action-button text-sm" type="submit">Logout</button>
				</form>
			{:else}
				<a class="subtle-button text-sm text-slate-700 hover:bg-white" href="/login">Login</a>
				<a class="action-button text-sm" href="/signup">Create Account</a>
			{/if}
		</div>
	</div>

	{#if !supabaseConfigured}
		<div class="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
			Supabase is not configured yet. Add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env` before using login or protected pages.
		</div>
	{/if}
</header>
