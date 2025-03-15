<script>
	import { onMount } from 'svelte';

	// Animation effect when page loads
	let pageLoaded = false;
	onMount(() => {
		setTimeout(() => {
			pageLoaded = true;
		}, 100);
	});
</script>

<svelte:head>
	<title>About Us | Sugar Tracker</title>
	<meta
		name="description"
		content="Learn about the mission and team behind Sugar Tracker, your partner in maintaining healthy sugar and nutrition habits."
	/>
</svelte:head>

<div class="bg-white">
	<!-- Hero section -->
	<div class="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-teal-400">
		<div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
		
		<div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
			<div class="text-center">
				<h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
					Our Story
					<span class="block text-teal-200">Our Mission</span>
				</h1>
				<p class="mx-auto mt-6 max-w-2xl text-xl text-green-50">
					Empowering healthier lives through awareness and education about nutrition.
				</p>
			</div>
		</div>
	</div>

	<!-- Mission section -->
	<div class="relative overflow-hidden py-16 sm:py-24">
		<div class="absolute top-0 left-0 -translate-x-1/4 translate-y-1/4">
			<svg class="h-64 w-64 opacity-10 text-green-600" fill="currentColor" viewBox="0 0 200 200">
				<circle cx="100" cy="100" r="100" />
			</svg>
		</div>
		
		<div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="text-base font-semibold uppercase tracking-wider text-green-600">Our Purpose</h2>
				<p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
					Making Nutrition Tracking Simple
				</p>
				<p class="mt-8 text-xl leading-relaxed text-gray-500">
					In a world where hidden sugars are prevalent in processed foods, we believe everyone deserves 
					accessible tools to make informed dietary choices. Our platform combines cutting-edge technology 
					with nutritional science to provide users with accurate tracking, meaningful insights, and 
					actionable recommendations.
				</p>
			</div>
		</div>
	</div>

	<!-- Values section -->
	<div class="bg-green-50 py-16 sm:py-24">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="text-center">
				<h2 class="text-base font-semibold uppercase tracking-wider text-green-600">Our Values</h2>
				<p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
					What Drives Us Forward
				</p>
			</div>
			
			<div class="mt-12 grid gap-8 md:grid-cols-3">
				<div class="group rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600"
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
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-bold text-gray-900">Accuracy</h3>
					<p class="text-gray-600">
						We're committed to providing the most accurate nutritional data available, partnering
						with trusted sources and continuously updating our database.
					</p>
				</div>
				<div class="group rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600"
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
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-bold text-gray-900">Empowerment</h3>
					<p class="text-gray-600">
						We believe in empowering users with knowledge and tools to make healthier choices, not
						restricting or judging their decisions.
					</p>
				</div>
				<div class="group rounded-2xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600"
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
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-xl font-bold text-gray-900">Privacy</h3>
					<p class="text-gray-600">
						We respect user privacy and are committed to protecting personal health data with the
						highest security standards.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- CTA Section -->
	<div class="bg-white py-16">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="rounded-2xl bg-gradient-to-r from-green-600 to-teal-500 px-6 py-16 text-center shadow-xl sm:p-16">
				<h2 class="text-3xl font-extrabold text-white sm:text-4xl">Join us in our mission</h2>
				<p class="mx-auto mt-6 max-w-xl text-lg text-green-50">
					Be part of a community that's taking control of their nutrition and health through
					informed choices.
				</p>
				<div class="mt-10 flex flex-wrap justify-center gap-4">
					<a
						href="/register"
						class="rounded-md bg-white px-8 py-3 font-medium text-green-700 shadow-md hover:bg-gray-100"
					>
						Sign Up Today
					</a>
					<a
						href="/contact"
						class="rounded-md border-2 border-white px-8 py-3 font-medium text-white hover:bg-white hover:text-green-600"
					>
						Get In Touch
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    .bg-grid-pattern {
        background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
    }
</style>
