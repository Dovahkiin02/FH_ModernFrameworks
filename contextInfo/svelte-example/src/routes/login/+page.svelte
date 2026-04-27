<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<h1 class="text-2xl font-bold mb-6">Login</h1>

{#if form?.error}
	<p class="text-red-600 mb-4">{form.error}</p>
{/if}

<form method="POST" action="?/login" use:enhance class="flex flex-col gap-4 max-w-sm">
	<label class="flex flex-col gap-1">
		Email
		<input type="email" name="email" required class="border rounded p-2" />
	</label>
	<label class="flex flex-col gap-1">
		Password
		<input type="password" name="password" required class="border rounded p-2" />
	</label>
	<button type="submit" class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
		Sign in
	</button>
</form>

<div class="max-w-sm mt-4">
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<div class="w-full border-t border-gray-300"></div>
		</div>
		<div class="relative flex justify-center text-sm">
			<span class="bg-white px-2 text-gray-500">or</span>
		</div>
	</div>

	<form method="POST" action="?/github" use:enhance>
		<button class="w-full rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
			Sign in with GitHub
		</button>
	</form>
</div>

<p class="mt-4 text-sm text-gray-600">
	Don't have an account? <a href="/signup" class="text-blue-600 hover:underline">Sign up</a>
</p>
