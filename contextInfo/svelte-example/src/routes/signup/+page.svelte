<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<h1 class="text-2xl font-bold mb-6">Sign Up</h1>

{#if form?.error}
	<p class="text-red-600 mb-4">{form.error}</p>
{/if}

{#if form?.success}
	<p class="text-green-600 mb-4">Account created! You can now <a href="/login" class="underline">log in</a>.</p>
{:else}
	<form method="POST" use:enhance class="flex flex-col gap-4 max-w-sm">
		<label class="flex flex-col gap-1">
			Email
			<input type="email" name="email" required class="border rounded p-2" />
		</label>
		<label class="flex flex-col gap-1">
			Password
			<input type="password" name="password" required minlength="6" class="border rounded p-2" />
		</label>
		<button type="submit" class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
			Sign up
		</button>
	</form>

	<p class="mt-4 text-sm text-gray-600">
		Already have an account? <a href="/login" class="text-blue-600 hover:underline">Log in</a>
	</p>
{/if}
