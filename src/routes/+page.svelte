<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Hero, Features, HowItWorks, CTA } from '$components';

	// Check if user is logged in based on the session data from the server
	$: isLoggedIn = $page.data.isAuthenticated;

	function navigateToDashboard() {
		goto('/dashboard');
	}
</script>

<svelte:head>
	<title>Sugar Tracker - Monitor Your Sugar Intake</title>
</svelte:head>

<!-- Hero Section -->
<div class="bg-gradient-to-r from-green-600 to-teal-500 text-white">
	<div class="container mx-auto px-4 py-16 sm:py-20">
		<div class="flex flex-col items-center lg:flex-row">
			<!-- Hero Content -->
			<div class="mb-10 lg:mb-0 lg:w-1/2">
				<h1 class="mb-6 text-4xl font-bold md:text-5xl">Take Control of Your Sugar Intake</h1>
				<p class="mb-8 text-xl opacity-90">
					Track, monitor, and manage your nutritional habits with our powerful and easy-to-use sugar
					tracking platform.
				</p>

				{#if isLoggedIn}
					<button
						on:click={navigateToDashboard}
						class="rounded-full bg-white px-8 py-4 font-bold text-green-600 shadow-lg transition hover:bg-gray-100"
					>
						Go to Dashboard
					</button>
				{:else}
					<div class="flex flex-wrap gap-4">
						<a
							href="/login"
							class="rounded-full bg-white px-8 py-4 font-bold text-green-600 shadow-lg transition hover:bg-gray-100"
						>
							Login
						</a>
						<a
							href="/register"
							class="rounded-full border-2 border-white px-8 py-4 font-bold text-white transition hover:bg-white/10"
						>
							Sign Up
						</a>
					</div>
				{/if}
			</div>

			<!-- Hero Image -->
			<div class="lg:w-1/2 lg:pl-12">
				<div class="rounded-lg bg-white p-2 shadow-2xl">
					<img
						src="https://images.unsplash.com/photo-1576867757603-05b134ebc379?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
						alt="Sugar Tracker Dashboard"
						class="rounded"
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Features Section -->
<div class="bg-white py-16">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold">Why Choose Sugar Tracker?</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="rounded-lg bg-gray-50 p-8 shadow-md transition hover:shadow-lg">
				<div
					class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Track Sugar Intake</h3>
				<p class="text-gray-600">
					Log your foods and automatically track sugar and other nutrients with our comprehensive
					database.
				</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-8 shadow-md transition hover:shadow-lg">
				<div
					class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Set Goals</h3>
				<p class="text-gray-600">
					Create personalized nutrition goals and monitor your progress with intuitive charts and
					insights.
				</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-8 shadow-md transition hover:shadow-lg">
				<div
					class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
						/>
					</svg>
				</div>
				<h3 class="mb-3 text-xl font-bold">Insights</h3>
				<p class="text-gray-600">
					Get detailed insights about your nutrition habits and patterns to make informed decisions.
				</p>
			</div>
		</div>
	</div>
</div>

<Features />
<HowItWorks />
{#if !isLoggedIn}
	<CTA />
{/if}
