<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	
	// Get redirect URL from query parameter
	$: redirectTo = $page.url.searchParams.get('redirectTo') || '/';
	
	let email = '';
	let password = '';
	let rememberMe = false;
	let isSubmitting = false;
	let error = null;
	
	// Check if already logged in
	onMount(() => {
		if ($page.data.isAuthenticated && browser) {
			goto(redirectTo);
		}
	});
	
	async function handleLogin() {
		if (!email || !password) {
			error = 'Please enter both email and password';
			return;
		}
		
		isSubmitting = true;
		error = null;
		
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
					rememberMe,
					redirectTo
				})
			});
			
			const data = await response.json();
			
			if (!response.ok || !data.success) {
				throw new Error(data.error || 'Login failed');
			}
			
			// Successful login, navigate to redirected page or dashboard
			if (browser) {
				window.location.href = data.redirectTo || '/';
			}
		} catch (err) {
			error = err.message;
		} finally {
			isSubmitting = false;
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

				<form on:submit|preventDefault={handleLogin}>
					{#if error}
						<div class="mb-6 rounded-md bg-red-100 p-4 text-center text-red-700">
							{error}
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

					<div class="mb-6">
						<label for="rememberMe" class="mb-2 block font-medium text-gray-700">Remember Me</label>
						<input
							type="checkbox"
							id="rememberMe"
							bind:checked={rememberMe}
							class="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-500 focus:ring focus:ring-offset-0 focus:ring-green-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="focus:ring-opacity-50 w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white shadow-lg transition hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isSubmitting ? 'Logging in...' : 'Login'}
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
