<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Hero, Features, HowItWorks, CTA } from '$components';
	import { onMount } from 'svelte';

	// Check if user is logged in based on the session data from the server
	$: isLoggedIn = $page.data.isAuthenticated;

	function navigateToDashboard() {
		goto('/dashboard');
	}
	
	// Add a simple animation effect when page loads
	let pageLoaded = false;
	onMount(() => {
		setTimeout(() => {
			pageLoaded = true;
		}, 100);
	});
</script>

<svelte:head>
	<title>Sugar Tracker - Monitor Your Sugar Intake</title>
</svelte:head>

<!-- Hero Section with enhanced design -->
<div class="relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-500 text-white">
	<!-- Decorative circles for visual interest -->
	<div class="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-green-500 opacity-20"></div>
	<div class="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-teal-400 opacity-10"></div>
	
	<div class="container relative mx-auto px-4 py-20 sm:py-24">
		<div class="flex flex-col items-center lg:flex-row">
			<!-- Hero Content with improved typography -->
			<div class="mb-12 transition-all duration-700 lg:mb-0 lg:w-1/2" class:translate-y-0={pageLoaded} class:translate-y-4={!pageLoaded} class:opacity-100={pageLoaded} class:opacity-0={!pageLoaded}>
				<h1 class="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
					Take Control of Your <span class="text-green-100">Sugar Intake</span>
				</h1>
				<p class="mb-8 text-xl leading-relaxed opacity-90">
					Track, monitor, and manage your nutritional habits with our powerful and easy-to-use sugar
					tracking platform.
				</p>

				{#if isLoggedIn}
					<button
						on:click={navigateToDashboard}
						class="rounded-full bg-white px-8 py-4 font-bold text-green-600 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
					>
						Go to Dashboard
					</button>
				{:else}
					<div class="flex flex-wrap gap-4">
						<a
							href="/login"
							class="rounded-full bg-white px-8 py-4 font-bold text-green-600 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
						>
							Login
						</a>
						<a
							href="/register"
							class="rounded-full border-2 border-white px-8 py-4 font-bold text-white transition-all duration-300 hover:bg-white hover:text-green-600 hover:shadow-lg hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
						>
							Sign Up
						</a>
					</div>
				{/if}
			</div>

			<!-- Hero Image with improved presentation -->
			<div class="lg:w-1/2 lg:pl-12 transition-all duration-700 delay-200" class:translate-y-0={pageLoaded} class:translate-y-4={!pageLoaded} class:opacity-100={pageLoaded} class:opacity-0={!pageLoaded}>
				<div class="relative">
					<!-- Decorative element behind image -->
					<div class="absolute -bottom-4 -right-4 h-full w-full rounded-lg bg-green-300 opacity-30"></div>
					
					<div class="relative rounded-lg bg-white p-3 shadow-2xl">
						<img
							src="https://images.unsplash.com/photo-1576867757603-05b134ebc379?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
							alt="Sugar Tracker Dashboard"
							class="rounded-lg shadow-inner"
						/>
						<!-- Subtle gradient overlay -->
						<div class="absolute inset-0 rounded-lg bg-gradient-to-tr from-green-600/10 to-transparent"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Features Section with improved cards -->
<div class="relative overflow-hidden bg-white py-20">
	<!-- Decorative shapes -->
	<div class="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-50"></div>
	<div class="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-green-50"></div>
	
	<div class="container relative mx-auto px-4">
		<h2 class="mb-16 text-center text-3xl font-bold text-gray-900 md:text-4xl">Why Choose Sugar Tracker?</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="group rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
				<div
					class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-7 w-7"
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
				<h3 class="mb-3 text-xl font-bold text-gray-900">Track Sugar Intake</h3>
				<p class="text-gray-600">
					Log your foods and automatically track sugar and other nutrients with our comprehensive
					database.
				</p>
			</div>

			<div class="group rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
				<div
					class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-7 w-7"
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
				<h3 class="mb-3 text-xl font-bold text-gray-900">Set Goals</h3>
				<p class="text-gray-600">
					Create personalized nutrition goals and monitor your progress with intuitive charts and
					insights.
				</p>
			</div>

			<div class="group rounded-xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
				<div
					class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-7 w-7"
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
				<h3 class="mb-3 text-xl font-bold text-gray-900">Insights</h3>
				<p class="text-gray-600">
					Get detailed insights about your nutrition habits and patterns to make informed decisions.
				</p>
			</div>
		</div>
	</div>
</div>

<!-- Section divider -->
<div class="w-full py-6 bg-gradient-to-r from-green-50 via-green-100 to-green-50">
	<div class="max-w-7xl mx-auto px-4">
		<div class="h-1 w-32 bg-green-500 mx-auto rounded-full"></div>
	</div>
</div>

<Features />
<HowItWorks />
{#if !isLoggedIn}
	<CTA />
{/if}