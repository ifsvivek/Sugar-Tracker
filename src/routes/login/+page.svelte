<script>
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMessage = '';
	let isLoading = false;

	async function handleSubmit() {
		errorMessage = '';
		isLoading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const result = await response.json();

			if (result.success) {
				// Redirect to dashboard after successful login
				goto('/dashboard');
			} else {
				errorMessage = result.error || 'Login failed';
			}
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = 'An error occurred during login';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Login - Sugar Tracker</title>
</svelte:head>

<div class="min-h-[calc(100vh-8rem)] bg-gradient-to-r from-green-50 to-teal-50 py-16">
	<div class="container mx-auto px-4">
		<div class="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
			<div class="p-8">
				<h1 class="mb-6 text-center text-3xl font-bold text-gray-800">Login to Sugar Tracker</h1>

				<form on:submit|preventDefault={handleSubmit}>
					{#if errorMessage}
						<div class="mb-6 rounded-md bg-red-100 p-4 text-center text-red-700">
							{errorMessage}
						</div>
					{/if}

					<div class="mb-6">
						<label for="email" class="mb-2 block font-medium text-gray-700">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							placeholder="Enter your email"
							class="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
						/>
					</div>

					<div class="mb-6">
						<label for="password" class="mb-2 block font-medium text-gray-700">Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							placeholder="Enter your password"
							class="w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="focus:ring-opacity-50 w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white shadow-lg transition hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isLoading ? 'Logging in...' : 'Login'}
					</button>

					<div class="mt-8 text-center">
						<span class="text-gray-600">Don't have an account?</span>
						<a href="/register" class="ml-1 font-medium text-green-600 hover:underline">Sign up</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
