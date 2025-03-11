<script>
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let success = '';

	async function handleSubmit() {
		loading = true;
		error = '';
		success = '';

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			loading = false;
			return;
		}

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			});

			const result = await response.json();

			if (response.ok && result.success) {
				success = 'Account created successfully!';
				setTimeout(() => goto('/dashboard'), 1000);
			} else {
				error = result.message || 'Registration failed. Please try again.';
			}
		} catch (err) {
			console.error('Registration error:', err);
			error = 'An error occurred. Please try again later.';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Sign Up - Sugar Tracker</title>
</svelte:head>

<div class="min-h-[calc(100vh-8rem)] bg-gradient-to-r from-green-50 to-teal-50 py-16">
	<div class="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-8 shadow-xl">
			<h1 class="mb-6 text-center text-2xl font-bold">Create Your Account</h1>

			{#if error}
				<div class="mb-4 rounded bg-red-100 p-3 text-red-700">
					{error}
				</div>
			{/if}

			{#if success}
				<div class="mb-4 rounded bg-green-100 p-3 text-green-700">
					{success}
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit}>
				<div class="mb-4">
					<label for="name" class="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
					<input
						type="text"
						id="name"
						bind:value={name}
						required
						placeholder="Enter your full name"
						class="w-full rounded-lg border border-gray-300 p-3 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
						disabled={loading}
					/>
				</div>

				<div class="mb-4">
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						required
						placeholder="Enter your email address"
						class="w-full rounded-lg border border-gray-300 p-3 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
						disabled={loading}
					/>
				</div>

				<div class="mb-4">
					<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label
					>
					<input
						type="password"
						id="password"
						bind:value={password}
						required
						minlength="6"
						placeholder="Create a secure password"
						class="w-full rounded-lg border border-gray-300 p-3 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
						disabled={loading}
					/>
				</div>

				<div class="mb-6">
					<label for="confirmPassword" class="mb-1 block text-sm font-medium text-gray-700"
						>Confirm Password</label
					>
					<input
						type="password"
						id="confirmPassword"
						bind:value={confirmPassword}
						required
						minlength="6"
						placeholder="Confirm your password"
						class="w-full rounded-lg border border-gray-300 p-3 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
						disabled={loading}
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="focus:ring-opacity-50 w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white shadow-lg transition hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
				>
					{loading ? 'Creating account...' : 'Sign Up'}
				</button>
			</form>

			<div class="mt-6 text-center text-sm">
				<p>
					Already have an account? <a
						href="/login"
						class="font-medium text-green-600 hover:underline">Login</a
					>
				</p>
			</div>
		</div>
	</div>
</div>
