<script>
	export let userName = 'User';
	export let isLoading = false;

	// Props for action button
	export let onActionClick = () => {};
	export let actionText = 'Set Goals';

	// Get today's date
	let today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric'
	});
</script>

<div class="bg-gradient-to-r from-green-600 to-teal-500 pt-4 pb-28 shadow-md md:pt-6 md:pb-32">
	<div class="relative mx-auto max-w-7xl px-4 pt-0 sm:px-6 lg:px-8 md:pt-6">
		<div class="md:flex md:items-center md:justify-between">
			<div class="min-w-0 flex-1">
				<h1 class="text-2xl font-bold text-white sm:text-4xl md:text-3xl">
					{#if isLoading}
						<div class="h-8 w-40 animate-pulse rounded bg-white/20 md:h-10 md:w-48"></div>
					{:else}
						Welcome, {userName}
					{/if}
				</h1>
				<p class="mt-1 text-base text-white opacity-90 md:text-lg">
					{today}
				</p>
			</div>
			<div class="mt-3 flex md:mt-0">
				<button
					on:click={onActionClick}
					class="inline-flex items-center rounded-full border border-transparent bg-white px-3 py-1.5 text-sm font-medium text-green-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none md:px-4 md:py-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1.5 h-4 w-4 md:mr-2 md:h-5 md:w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
						/>
					</svg>
					{actionText}
				</button>
			</div>
		</div>
	</div>
</div>
