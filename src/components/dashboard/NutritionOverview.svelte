<script>
	export let nutritionData = [];
	export let totalCarbs = 0;
	export let totalProtein = 0;
	export let totalFat = 0;
	export let totalSodium = 0;
	export let additionalNutrients = []; // New prop for additional nutrients
	
	let showAdditionalNutrients = false; // Toggle for expanding additional nutrients section
	
	// Function to toggle additional nutrients visibility
	function toggleAdditionalNutrients() {
		showAdditionalNutrients = !showAdditionalNutrients;
	}

    // Format a number with its unit
    function formatValueWithUnit(value, unit) {
        if (typeof value !== 'number') return '0' + unit;
        return value.toFixed(1) + unit;
    }
</script>

<div class="p-4 md:p-6">
	<div class="mb-4 flex flex-wrap items-center justify-between md:mb-6">
		<h3 class="text-lg font-medium text-gray-900">Nutrition Overview</h3>
		<span class="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
			{#if nutritionData && nutritionData.length}
				{Math.round(totalCarbs * 4 + totalProtein * 4 + totalFat * 9)} calories today
			{:else}
				0 calories today
			{/if}
		</span>
	</div>

	<!-- Nutrition Goals Progress -->
	<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mb-6">
		{#each nutritionData as item}
			<div
				class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md active:bg-gray-50 md:p-4"
			>
				<div class="mb-2 flex items-center justify-between">
					<span class="font-medium text-gray-900">{item.name}</span>
					<span class="text-sm font-medium text-gray-700">
						{item.value} / {item.goal}
					</span>
				</div>
				<div class="relative mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-100 md:h-4">
					<div
						class={`absolute top-0 left-0 h-full rounded-full ${
							item.exceeded
								? item.name === 'Protein'
									? 'bg-orange-500'
									: 'bg-red-500'
								: item.name === 'Protein'
									? 'bg-green-500'
									: 'bg-blue-500'
						}`}
						style={`width: ${Math.min(item.percentage, 100)}%`}
					></div>
				</div>
				<div class="flex items-center justify-between">
					<p class="text-xs text-gray-500">
						{item.name === 'Protein' ? 'Minimum target' : 'Maximum limit'}
					</p>
					<p
						class={`text-xs font-medium ${item.exceeded ? (item.name === 'Protein' ? 'text-orange-600' : 'text-red-600') : 'text-green-600'}`}
					>
						{item.percentage}%
					</p>
				</div>
			</div>
		{/each}
	</div>
	
	<!-- Additional Nutrients Section -->
	{#if additionalNutrients && additionalNutrients.length > 0}
		<div class="mt-2 border-t border-gray-100 pt-4">
			<button 
				on:click={toggleAdditionalNutrients}
				class="flex w-full items-center justify-between text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
			>
				<span class="font-medium">Additional Nutrients</span>
				<svg 
					xmlns="http://www.w3.org/2000/svg" 
					class="h-5 w-5 transform transition-transform duration-200" 
					class:rotate-180={showAdditionalNutrients}
					fill="none" 
					viewBox="0 0 24 24" 
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			
			{#if showAdditionalNutrients}
				<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
					{#each additionalNutrients as nutrient}
						<div class="rounded-lg border border-gray-100 bg-gray-50 p-3">
							<div class="flex justify-between">
								<span class="text-sm font-medium text-gray-700">{nutrient.name}</span>
								<span class="text-sm text-gray-800">{formatValueWithUnit(nutrient.value, nutrient.unit)}</span>
							</div>
							{#if nutrient.goal}
								<div class="mt-1 text-xs text-gray-500">
									<span>{nutrient.is_minimum ? 'Min: ' : 'Max: '}{nutrient.goal}{nutrient.unit}</span>
									{#if typeof nutrient.percentage === 'number'}
										<span class={nutrient.exceeded ? 'text-red-500' : 'text-green-500'} class:ml-1={true}>
											({nutrient.percentage}%)
										</span>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
