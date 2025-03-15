<script>
	export let foodLogs = [];
	export let isLoading = false;
	export let onAddClick = () => {};

	// Helper function
	export let getNutrientAmount = (nutrients, nutrientId) => {
		if (!Array.isArray(nutrients)) return 0;
		const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
		return nutrient ? Math.round(nutrient.amount * 10) / 10 : 0;
	};
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-md">
	<div class="border-b border-gray-200 bg-gray-50 px-4 py-3 md:px-6 md:py-4">
		<div class="flex items-center justify-between">
			<h3 class="flex items-center text-base font-medium text-gray-900 md:text-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-5 w-5 text-gray-500"
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
				Recent Entries
			</h3>
			<button
				on:click={onAddClick}
				class="flex items-center text-sm font-medium text-green-600 hover:text-green-700 hover:underline focus:outline-none active:text-green-800"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-1 h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Add
			</button>
		</div>
	</div>

	{#if isLoading}
		<div class="flex h-40 items-center justify-center">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
			></div>
		</div>
	{:else}
		<ul class="divide-y divide-gray-200">
			{#if foodLogs && foodLogs.length}
				{#each foodLogs.slice(0, 5) as log}
					<li
						class="px-4 py-3 transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100 md:px-6 md:py-4"
					>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-medium text-gray-900 md:text-base">{log.food_name}</p>
								<p class="text-xs text-gray-500 md:text-sm">
									{new Date(log.consumed_at).toLocaleDateString()} ·
									{log.meal_type?.charAt(0).toUpperCase() + log.meal_type?.slice(1) || 'Meal'}
								</p>
							</div>
							<div class="text-right">
								<p class="text-sm font-medium text-gray-900 md:text-base">
									{(getNutrientAmount(log.nutrients, 1) * log.serving_size).toFixed(1)}g
								</p>
								<p class="text-xs text-gray-500 md:text-sm">
									{log.serving_size} serving{log.serving_size !== 1 ? 's' : ''}
								</p>
							</div>
						</div>
					</li>
				{/each}
			{:else}
				<li class="px-4 py-8 text-center">
					<p class="text-gray-500">No entries yet</p>
					<p class="mt-1 text-xs text-gray-400">Start logging your food to see it here</p>
					<button
						on:click={onAddClick}
						class="mt-3 inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none active:bg-green-800"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-1.5 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							/>
						</svg>
						Log your first meal
					</button>
				</li>
			{/if}
		</ul>
	{/if}
</div>
