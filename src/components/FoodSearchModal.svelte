<script>
	import { createEventDispatcher } from 'svelte';
	import { searchFoods } from '$lib/usda';

	export let isOpen = false;
	const dispatch = createEventDispatcher();

	let searchQuery = '';
	let searchResults = [];
	let isLoading = false;
	let error = null;

	async function handleSearch() {
		if (!searchQuery.trim()) return;

		isLoading = true;
		error = null;
		searchResults = [];

		try {
			const response = await searchFoods(searchQuery);
			if (response.foods) {
				searchResults = response.foods;
			} else {
				error = 'No results found';
			}
		} catch (err) {
			console.error('Search error:', err);
			error = 'Failed to search foods. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function selectFood(food) {
		dispatch('select', { food });
		close();
	}

	function close() {
		dispatch('close');
		searchQuery = '';
		searchResults = [];
		error = null;
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div
			class="flex min-h-screen items-center justify-center px-4 py-6 text-center sm:p-0 md:py-12"
		>
			<div
				class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
				on:click={close}
			></div>

			<div
				class="relative inline-block w-full max-w-xl transform overflow-hidden rounded-lg bg-white px-4 py-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:p-6 sm:align-middle"
			>
				<div class="absolute top-3 right-3">
					<button
						on:click={close}
						class="rounded-full bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none active:bg-gray-200"
					>
						<span class="sr-only">Close</span>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div class="mb-4 md:mb-5">
					<h3 class="text-lg font-medium text-gray-900">Search Foods</h3>
					<p class="mt-1 text-xs text-gray-500 md:text-sm">Find foods to add to your log</p>
				</div>

				<div class="mb-4 md:mb-5">
					<div class="relative rounded-md shadow-sm">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search for a food..."
							class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 pr-16 text-sm placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 focus:outline-none md:px-4 md:py-3"
							on:keydown={(e) => e.key === 'Enter' && handleSearch()}
						/>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3">
							<button
								on:click={handleSearch}
								class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none active:bg-green-800 md:px-3 md:py-1 md:text-sm"
								disabled={isLoading}
								type="button"
							>
								{#if isLoading}
									<svg
										class="mr-1 h-3 w-3 animate-spin md:h-4 md:w-4"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								{:else}
									<svg
										class="mr-1 h-3 w-3 md:h-4 md:w-4"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								{/if}
								Search
							</button>
						</div>
					</div>

					{#if error}
						<div class="mt-2 rounded-md bg-red-50 p-2">
							<p class="text-xs text-red-600">{error}</p>
						</div>
					{/if}
				</div>

				{#if searchResults.length > 0}
					<div
						class="mt-4 max-h-72 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 sm:max-h-96"
					>
						{#each searchResults as food, i}
							<button
								on:click={() => selectFood(food)}
								class="w-full border-b border-gray-200 bg-white px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-green-50 active:bg-green-100 md:px-4 md:py-3"
							>
								<div class="text-sm font-medium text-gray-900 md:text-base">{food.description}</div>
								{#if food.brandName}
									<div class="text-xs text-gray-500 md:text-sm">{food.brandName}</div>
								{/if}
							</button>
						{/each}
					</div>
				{:else if searchResults.length === 0 && !isLoading && searchQuery}
					<div class="flex flex-col items-center justify-center py-6 text-center md:py-8">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mb-2 h-8 w-8 text-gray-400 md:h-10 md:w-10"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p class="text-gray-600">No results found</p>
						<p class="mt-1 text-xs text-gray-500">Try a different search term</p>
					</div>
				{:else if !searchResults.length && !searchQuery && !isLoading}
					<div class="flex flex-col items-center justify-center py-6 text-center md:py-8">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mb-2 h-8 w-8 text-gray-400 md:h-10 md:w-10"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<p class="text-gray-600">Search for foods to add to your log</p>
						<p class="mt-1 text-xs text-gray-500">Try searching for a food item or brand name</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
