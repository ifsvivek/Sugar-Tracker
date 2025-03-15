<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let todayLogs = [];
	export let getNutrientAmount = () => 0;

	// Update delete function to use log_id
	async function deleteEntry(logId) {
		if (!confirm('Are you sure you want to delete this entry?')) return;

		try {
			const response = await fetch(`/api/foods/log/${logId}`, {
				method: 'DELETE',
				credentials: 'include'
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'Failed to delete entry');
			}

			// Dispatch deleted event and update UI
			dispatch('deleted', { logId });

			// Remove the deleted log from todayLogs
			todayLogs = todayLogs.filter((log) => log.log_id !== logId);
		} catch (error) {
			console.error('Error deleting entry:', error);
			alert('Failed to delete entry: ' + error.message);
		}
	}

	// Calculate meal-based totals
	$: breakfastLogs = todayLogs.filter((log) => log.meal_type?.toLowerCase() === 'breakfast');
	$: lunchLogs = todayLogs.filter((log) => log.meal_type?.toLowerCase() === 'lunch');
	$: dinnerLogs = todayLogs.filter((log) => log.meal_type?.toLowerCase() === 'dinner');
	$: snackLogs = todayLogs.filter((log) => log.meal_type?.toLowerCase() === 'snack');

	// Function to format number to 1 decimal place
	function formatNumber(num) {
		return Number(parseFloat(num).toFixed(1));
	}

	// Function to calculate total sugar for a meal
	function calculateMealSugar(logs) {
		const total = logs.reduce((sum, log) => {
			const sugarAmount = getNutrientAmount(log.nutrients, 1);
			return sum + sugarAmount * log.serving_size;
		}, 0);
		return formatNumber(total);
	}

	$: breakfastSugar = calculateMealSugar(breakfastLogs);
	$: lunchSugar = calculateMealSugar(lunchLogs);
	$: dinnerSugar = calculateMealSugar(dinnerLogs);
	$: snackSugar = calculateMealSugar(snackLogs);

	// Function to format time
	function formatTime(dateStr) {
		return new Date(dateStr).toLocaleTimeString([], {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	// Expanded log to show additional nutrients
	let expandedLogId = null;

	function toggleExpandLog(logId) {
		expandedLogId = expandedLogId === logId ? null : logId;
	}

	// Format nutrient value with appropriate units and 1 decimal place
	function formatNutrientValue(nutrient) {
		if (!nutrient) return 'N/A';
		const amount = formatNumber(nutrient.amount);
		return `${amount}${nutrient.unit}`;
	}

	// Get nutrient amount with 1 decimal place
	function getNutrientDisplay(nutrients, nutrientId, servingSize = 1) {
		const amount = getNutrientAmount(nutrients, nutrientId) * servingSize;
		return formatNumber(amount);
	}
</script>

<div class="border-t border-gray-200">
	{#if todayLogs.length === 0}
		<div class="py-8 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mx-auto h-12 w-12 text-gray-300"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<p class="mt-2 text-gray-500">No food logged today</p>
			<p class="mt-1 text-sm text-gray-400">Add your first meal to see it here</p>
		</div>
	{:else}
		<!-- Mobile view - grouped by meal -->
		<div class="block md:hidden">
			{#if breakfastLogs.length > 0}
				<div class="border-b border-gray-100">
					<div class="flex items-center justify-between bg-gray-50 px-4 py-3">
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-4 w-4 text-orange-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
							<span class="font-medium text-gray-800">Breakfast</span>
						</div>
						<span class="text-sm text-gray-600">{breakfastSugar}g sugar</span>
					</div>
					<div class="divide-y divide-gray-100">
						{#each breakfastLogs as log}
							<div class="flex items-center justify-between px-4 py-3">
								<div>
									<div class="text-sm font-medium">{log.food_name}</div>
									<div class="mt-0.5 text-xs text-gray-500">
										{formatTime(log.consumed_at)} · {log.serving_size}
										{log.serving_size !== 1 ? 'servings' : 'serving'}
									</div>

									<!-- Expand button for additional nutrients -->
									<div class="mt-1 flex items-center gap-2">
										<button
											on:click={() => toggleExpandLog(log.log_id)}
											class="text-xs text-green-600 hover:underline focus:outline-none"
										>
											{expandedLogId === log.log_id ? 'Hide details' : 'Show all nutrients'}
										</button>
										<button
											on:click={() => deleteEntry(log.log_id)}
											class="text-xs text-red-600 hover:underline focus:outline-none"
										>
											Delete
										</button>
									</div>

									<!-- Additional nutrients when expanded -->
									{#if expandedLogId === log.log_id}
										<div class="mt-2 rounded bg-gray-50 p-2">
											<div class="grid grid-cols-2 gap-1 text-xs">
												{#each log.nutrients.filter((n) => n.nutrient_id > 1) as nutrient}
													<div class="flex justify-between">
														<span class="text-gray-600">{nutrient.name}:</span>
														<span class="font-medium"
															>{getNutrientDisplay(
																log.nutrients,
																nutrient.nutrient_id,
																log.serving_size
															)}{nutrient.unit}</span
														>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
								<div class="text-sm font-medium">
									{getNutrientDisplay(log.nutrients, 1, log.serving_size)}g
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if lunchLogs.length > 0}
				<div class="border-b border-gray-100">
					<div class="flex items-center justify-between bg-gray-50 px-4 py-3">
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-4 w-4 text-green-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span class="font-medium text-gray-800">Lunch</span>
						</div>
						<span class="text-sm text-gray-600">{lunchSugar}g sugar</span>
					</div>
					<div class="divide-y divide-gray-100">
						{#each lunchLogs as log}
							<div class="flex items-center justify-between px-4 py-3">
								<div>
									<div class="text-sm font-medium">{log.food_name}</div>
									<div class="mt-0.5 text-xs text-gray-500">
										{formatTime(log.consumed_at)} · {log.serving_size}
										{log.serving_size !== 1 ? 'servings' : 'serving'}
									</div>

									<!-- Expand button for additional nutrients -->
									<div class="mt-1 flex items-center gap-2">
										<button
											on:click={() => toggleExpandLog(log.log_id)}
											class="text-xs text-green-600 hover:underline focus:outline-none"
										>
											{expandedLogId === log.log_id ? 'Hide details' : 'Show all nutrients'}
										</button>
										<button
											on:click={() => deleteEntry(log.log_id)}
											class="text-xs text-red-600 hover:underline focus:outline-none"
										>
											Delete
										</button>
									</div>

									<!-- Additional nutrients when expanded -->
									{#if expandedLogId === log.log_id}
										<div class="mt-2 rounded bg-gray-50 p-2">
											<div class="grid grid-cols-2 gap-1 text-xs">
												{#each log.nutrients.filter((n) => n.nutrient_id > 1) as nutrient}
													<div class="flex justify-between">
														<span class="text-gray-600">{nutrient.name}:</span>
														<span class="font-medium"
															>{getNutrientDisplay(
																log.nutrients,
																nutrient.nutrient_id,
																log.serving_size
															)}{nutrient.unit}</span
														>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
								<div class="text-sm font-medium">
									{getNutrientDisplay(log.nutrients, 1, log.serving_size)}g
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if dinnerLogs.length > 0}
				<div class="border-b border-gray-100">
					<div class="flex items-center justify-between bg-gray-50 px-4 py-3">
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-4 w-4 text-blue-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
								/>
							</svg>
							<span class="font-medium text-gray-800">Dinner</span>
						</div>
						<span class="text-sm text-gray-600">{dinnerSugar}g sugar</span>
					</div>
					<div class="divide-y divide-gray-100">
						{#each dinnerLogs as log}
							<div class="flex items-center justify-between px-4 py-3">
								<div>
									<div class="text-sm font-medium">{log.food_name}</div>
									<div class="mt-0.5 text-xs text-gray-500">
										{formatTime(log.consumed_at)} · {log.serving_size}
										{log.serving_size !== 1 ? 'servings' : 'serving'}
									</div>

									<!-- Expand button for additional nutrients -->
									<div class="mt-1 flex items-center gap-2">
										<button
											on:click={() => toggleExpandLog(log.log_id)}
											class="text-xs text-green-600 hover:underline focus:outline-none"
										>
											{expandedLogId === log.log_id ? 'Hide details' : 'Show all nutrients'}
										</button>
										<button
											on:click={() => deleteEntry(log.log_id)}
											class="text-xs text-red-600 hover:underline focus:outline-none"
										>
											Delete
										</button>
									</div>

									<!-- Additional nutrients when expanded -->
									{#if expandedLogId === log.log_id}
										<div class="mt-2 rounded bg-gray-50 p-2">
											<div class="grid grid-cols-2 gap-1 text-xs">
												{#each log.nutrients.filter((n) => n.nutrient_id > 1) as nutrient}
													<div class="flex justify-between">
														<span class="text-gray-600">{nutrient.name}:</span>
														<span class="font-medium"
															>{getNutrientDisplay(
																log.nutrients,
																nutrient.nutrient_id,
																log.serving_size
															)}{nutrient.unit}</span
														>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
								<div class="text-sm font-medium">
									{getNutrientDisplay(log.nutrients, 1, log.serving_size)}g
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if snackLogs.length > 0}
				<div class="border-b border-gray-100">
					<div class="flex items-center justify-between bg-gray-50 px-4 py-3">
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-4 w-4 text-purple-500"
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
							<span class="font-medium text-gray-800">Snacks</span>
						</div>
						<span class="text-sm text-gray-600">{snackSugar}g sugar</span>
					</div>
					<div class="divide-y divide-gray-100">
						{#each snackLogs as log}
							<div class="flex items-center justify-between px-4 py-3">
								<div>
									<div class="text-sm font-medium">{log.food_name}</div>
									<div class="mt-0.5 text-xs text-gray-500">
										{formatTime(log.consumed_at)} · {log.serving_size}
										{log.serving_size !== 1 ? 'servings' : 'serving'}
									</div>

									<!-- Expand button for additional nutrients -->
									<div class="mt-1 flex items-center gap-2">
										<button
											on:click={() => toggleExpandLog(log.log_id)}
											class="text-xs text-green-600 hover:underline focus:outline-none"
										>
											{expandedLogId === log.log_id ? 'Hide details' : 'Show all nutrients'}
										</button>
										<button
											on:click={() => deleteEntry(log.log_id)}
											class="text-xs text-red-600 hover:underline focus:outline-none"
										>
											Delete
										</button>
									</div>

									<!-- Additional nutrients when expanded -->
									{#if expandedLogId === log.log_id}
										<div class="mt-2 rounded bg-gray-50 p-2">
											<div class="grid grid-cols-2 gap-1 text-xs">
												{#each log.nutrients.filter((n) => n.nutrient_id > 1) as nutrient}
													<div class="flex justify-between">
														<span class="text-gray-600">{nutrient.name}:</span>
														<span class="font-medium"
															>{getNutrientDisplay(
																log.nutrients,
																nutrient.nutrient_id,
																log.serving_size
															)}{nutrient.unit}</span
														>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
								<div class="text-sm font-medium">
									{getNutrientDisplay(log.nutrients, 1, log.serving_size)}g
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Desktop view - table -->
		<div class="hidden overflow-x-auto md:block">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Time
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Meal
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Food
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Servings
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Sugar
						</th>
						<th scope="col" class="relative px-6 py-3">
							<span class="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each todayLogs as log}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{formatTime(log.consumed_at)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold
                  {log.meal_type?.toLowerCase() === 'breakfast'
										? 'bg-orange-100 text-orange-800'
										: log.meal_type?.toLowerCase() === 'lunch'
											? 'bg-green-100 text-green-800'
											: log.meal_type?.toLowerCase() === 'dinner'
												? 'bg-blue-100 text-blue-800'
												: 'bg-purple-100 text-purple-800'}"
								>
									{log.meal_type?.charAt(0).toUpperCase() + log.meal_type?.slice(1) || 'Meal'}
								</span>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm font-medium text-gray-900">{log.food_name}</div>
								{#if log.brand_name}
									<div class="text-xs text-gray-500">{log.brand_name}</div>
								{/if}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{log.serving_size}
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
								{getNutrientDisplay(log.nutrients, 1, log.serving_size)}g
							</td>
							<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
								<button
									on:click={() => deleteEntry(log.log_id)}
									class="text-red-600 hover:text-red-900 focus:outline-none"
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
