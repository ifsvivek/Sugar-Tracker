<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { FoodSearchModal, FoodLogForm } from '$components';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Get user data from the server
	$: userName = data.user?.name || 'User';
	$: foodLogs = data.foodLogs || [];
	$: totalSugar = data.totalSugar || 0;
	$: sugarGoal = data.sugarGoal || 25;
	$: sugarPercentage = Math.round((totalSugar / sugarGoal) * 100);
	$: sugarExceeded = totalSugar > sugarGoal;

	// Group meals by date
	$: mealsByDate = groupMealsByDate(foodLogs);
	$: recentDates = [...Object.keys(mealsByDate)].sort((a, b) => new Date(b) - new Date(a));

	// Additional nutrient tracking
	$: totalCarbs = calculateNutrientTotal(foodLogs, 2);
	$: totalProtein = calculateNutrientTotal(foodLogs, 3);
	$: totalFat = calculateNutrientTotal(foodLogs, 4);
	$: totalFiber = calculateNutrientTotal(foodLogs, 5);

	// Formatted nutrient data for display
	$: nutritionData = [
		{
			name: 'Sugar',
			value: `${totalSugar}g`,
			goal: `${sugarGoal}g`,
			percentage: sugarPercentage,
			exceeded: totalSugar > sugarGoal
		},
		{
			name: 'Carbs',
			value: `${totalCarbs}g`,
			goal: '150g',
			percentage: Math.round((totalCarbs / 150) * 100),
			exceeded: totalCarbs > 150
		},
		{
			name: 'Protein',
			value: `${totalProtein}g`,
			goal: '60g',
			percentage: Math.round((totalProtein / 60) * 100),
			exceeded: totalProtein > 60
		},
		{
			name: 'Fat',
			value: `${totalFat}g`,
			goal: '50g',
			percentage: Math.round((totalFat / 50) * 100),
			exceeded: totalFat > 50
		},
		{
			name: 'Fiber',
			value: `${totalFiber}g`,
			goal: '25g',
			percentage: Math.round((totalFiber / 25) * 100),
			exceeded: totalFiber > 25
		}
	];

	// Modals state
	let isSearchModalOpen = false;
	let isFoodLogFormOpen = false;
	let selectedFood = null;
	let isDeleteConfirmOpen = false;
	let mealToDelete = null;
	let isDeleting = false;

	function handleFoodSelect(event) {
		selectedFood = event.detail.food;
		isFoodLogFormOpen = true;
	}

	function handleLogSuccess() {
		// Reload the page to refresh data
		window.location.reload();
	}

	function confirmDeleteMeal(meal) {
		mealToDelete = meal;
		isDeleteConfirmOpen = true;
	}

	async function deleteMeal() {
		if (!mealToDelete) return;

		isDeleting = true;

		try {
			const response = await fetch(`/api/foods/log/${mealToDelete.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete meal');
			}

			// Close modal and refresh data
			isDeleteConfirmOpen = false;
			mealToDelete = null;
			window.location.reload();
		} catch (error) {
			console.error('Error deleting meal:', error);
		} finally {
			isDeleting = false;
		}
	}

	function cancelDelete() {
		isDeleteConfirmOpen = false;
		mealToDelete = null;
	}

	// Helper functions
	function groupMealsByDate(meals) {
		const groups = {};

		meals.forEach((meal) => {
			const date = new Date(meal.consumed_at);
			const dateStr = date.toLocaleDateString();

			if (!groups[dateStr]) {
				groups[dateStr] = [];
			}

			groups[dateStr].push({
				id: meal.log_id,
				name: meal.meal_type || 'Meal',
				time: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
				food: meal.food_name,
				brand: meal.brand_name,
				sugar: getNutrientAmount(meal.nutrients, 1) * meal.serving_size,
				carbs: getNutrientAmount(meal.nutrients, 2) * meal.serving_size,
				protein: getNutrientAmount(meal.nutrients, 3) * meal.serving_size,
				fat: getNutrientAmount(meal.nutrients, 4) * meal.serving_size,
				fiber: getNutrientAmount(meal.nutrients, 5) * meal.serving_size,
				servingSize: meal.serving_size
			});
		});

		return groups;
	}

	function getNutrientAmount(nutrients, nutrientId) {
		if (!Array.isArray(nutrients)) return 0;
		const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
		return nutrient ? Math.round(nutrient.amount * 10) / 10 : 0;
	}

	function calculateNutrientTotal(logs, nutrientId) {
		return (
			Math.round(
				logs.reduce((sum, log) => {
					const amount = getNutrientAmount(log.nutrients, nutrientId);
					return sum + amount * log.serving_size;
				}, 0) * 10
			) / 10
		);
	}

	function formatDate(dateStr) {
		const date = new Date(dateStr);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			return date.toLocaleDateString('en-US', {
				weekday: 'short',
				month: 'short',
				day: 'numeric'
			});
		}
	}
</script>

<svelte:head>
	<title>Dashboard - Sugar Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-16">
	<div class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">Welcome, {userName}!</h1>

		<!-- Sugar Tracker Card -->
		<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Daily Sugar Intake -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold text-gray-800">Today's Sugar</h2>
				<div class="mb-2 flex items-end">
					<span class={`text-4xl font-bold ${sugarExceeded ? 'text-red-600' : 'text-green-600'}`}
						>{totalSugar}g</span
					>
					<span class="ml-2 text-gray-500">of {sugarGoal}g</span>
				</div>

				<!-- Progress bar -->
				<div class="mb-2 h-2.5 w-full rounded-full bg-gray-200">
					<div
						class={`h-2.5 rounded-full ${sugarExceeded ? 'bg-red-600' : 'bg-green-600'}`}
						style="width: {Math.min(sugarPercentage, 100)}%"
					></div>
				</div>
				<p class="text-sm text-gray-600">
					<span class={sugarExceeded ? 'font-medium text-red-600' : 'text-gray-600'}
						>{sugarPercentage}% of daily goal</span
					>
				</p>
			</div>

			<!-- Quick Actions -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold text-gray-800">Quick Actions</h2>
				<div class="flex flex-col gap-3 sm:flex-row">
					<button
						class="focus:ring-opacity-50 flex-1 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
						on:click={() => (isSearchModalOpen = true)}
					>
						Log Food
					</button>
					<button
						class="focus:ring-opacity-50 flex-1 rounded border border-green-600 px-4 py-2 text-green-600 hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:outline-none"
					>
						Add Goal
					</button>
				</div>
			</div>

			<!-- Nutrition Tip -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h2 class="mb-4 text-xl font-semibold text-gray-800">Nutrition Tip</h2>
				<p class="text-gray-600">
					Try replacing sugary drinks with water or unsweetened tea to reduce your daily sugar
					intake.
				</p>
			</div>
		</div>

		<!-- Nutrition Breakdown -->
		<div class="mb-8 overflow-x-auto rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Nutrition Breakdown</h2>
			<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
				{#each nutritionData as item}
					<div class="rounded-md border border-gray-200 p-4">
						<h3 class="text-sm font-medium text-gray-500">{item.name}</h3>
						<div class="mt-1 flex items-end">
							<span
								class={`text-2xl font-semibold ${item.exceeded ? 'text-red-600' : 'text-gray-800'}`}
								>{item.value}</span
							>
							<span class="ml-1 text-sm text-gray-500">/ {item.goal}</span>
						</div>
						<div class="mt-2 h-1.5 w-full rounded-full bg-gray-200">
							<div
								class={`h-1.5 rounded-full ${item.exceeded ? 'bg-red-600' : 'bg-green-600'}`}
								style="width: {Math.min(item.percentage, 100)}%"
							></div>
						</div>
						{#if item.exceeded}
							<p class="mt-1 text-xs text-red-600">
								{item.percentage}% of goal
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent Meals -->
		<div class="mb-8 rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold text-gray-800">Recent Meals</h2>

			{#if recentDates.length > 0}
				{#each recentDates as dateStr}
					<div class="mb-6">
						<h3 class="mb-3 font-medium text-gray-700">{formatDate(dateStr)}</h3>

						<!-- Desktop view: Table -->
						<div class="hidden md:block">
							<div class="overflow-x-auto">
								<table class="min-w-full divide-y divide-gray-200">
									<thead>
										<tr>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Meal</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Food</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Serving</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Sugar</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Carbs</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Protein</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Fat</th>
											<th class="px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										{#each mealsByDate[dateStr] as meal}
											<tr>
												<td class="px-4 py-3 text-sm text-gray-900">{meal.name}</td>
												<td class="px-4 py-3 text-sm text-gray-600">{meal.time}</td>
												<td class="px-4 py-3 text-sm text-gray-900">
													{meal.food}
													{#if meal.brand}
														<div class="text-xs text-gray-500">{meal.brand}</div>
													{/if}
												</td>
												<td class="px-4 py-3 text-sm text-gray-900">{meal.servingSize}</td>
												<td class="px-4 py-3 text-sm text-gray-900">{meal.sugar.toFixed(1)}g</td>
												<td class="px-4 py-3 text-sm text-gray-900">{meal.carbs.toFixed(1)}g</td>
												<td class="px-4 py-3 text-sm text-gray-900">{meal.protein.toFixed(1)}g</td>
												<td class="px-4 py-3 text-sm text-gray-900">{meal.fat.toFixed(1)}g</td>
												<td class="px-4 py-3 text-right text-sm">
													<button
														class="text-red-600 hover:text-red-800"
														on:click={() => confirmDeleteMeal(meal)}
													>
														<span class="sr-only">Delete</span>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</button>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>

						<!-- Mobile view: Cards -->
						<div class="md:hidden">
							<div class="space-y-4">
								{#each mealsByDate[dateStr] as meal}
									<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
										<div class="mb-2 flex justify-between">
											<div>
												<span class="font-medium text-gray-900">{meal.name}</span>
												<span class="ml-2 text-sm text-gray-600">{meal.time}</span>
											</div>
											<button
												class="text-red-600 hover:text-red-800"
												on:click={() => confirmDeleteMeal(meal)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>

										<div class="mb-3">
											<p class="font-medium text-gray-900">{meal.food}</p>
											{#if meal.brand}
												<p class="text-sm text-gray-500">{meal.brand}</p>
											{/if}
											<p class="text-sm text-gray-600">Serving size: {meal.servingSize}</p>
										</div>

										<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
											<div class="rounded bg-gray-50 px-3 py-2">
												<p class="text-xs text-gray-500">Sugar</p>
												<p class="font-medium">{meal.sugar.toFixed(1)}g</p>
											</div>
											<div class="rounded bg-gray-50 px-3 py-2">
												<p class="text-xs text-gray-500">Carbs</p>
												<p class="font-medium">{meal.carbs.toFixed(1)}g</p>
											</div>
											<div class="rounded bg-gray-50 px-3 py-2">
												<p class="text-xs text-gray-500">Protein</p>
												<p class="font-medium">{meal.protein.toFixed(1)}g</p>
											</div>
											<div class="rounded bg-gray-50 px-3 py-2">
												<p class="text-xs text-gray-500">Fat</p>
												<p class="font-medium">{meal.fat.toFixed(1)}g</p>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<p class="text-gray-600">No meals recorded. Start tracking to see your data!</p>
			{/if}
		</div>
	</div>
</div>

<!-- Existing Modals -->
<FoodSearchModal
	isOpen={isSearchModalOpen}
	on:close={() => (isSearchModalOpen = false)}
	on:select={handleFoodSelect}
/>

<FoodLogForm
	isOpen={isFoodLogFormOpen}
	food={selectedFood}
	on:close={() => (isFoodLogFormOpen = false)}
	on:success={handleLogSuccess}
/>

<!-- Delete Confirmation Modal -->
{#if isDeleteConfirmOpen}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-screen items-center justify-center px-4 text-center">
			<div
				class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
				on:click={cancelDelete}
			></div>

			<div
				class="inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
			>
				<div class="mb-4">
					<h3 class="text-lg font-medium text-gray-900">Delete Food Log</h3>
					<p class="mt-2 text-sm text-gray-500">
						Are you sure you want to delete this food log? This action cannot be undone.
					</p>
					{#if mealToDelete}
						<div class="mt-3 rounded-md bg-gray-50 p-3">
							<p class="font-medium">{mealToDelete.food}</p>
							<p class="text-sm text-gray-500">
								{mealToDelete.name} at {mealToDelete.time} - {mealToDelete.servingSize} serving(s)
							</p>
						</div>
					{/if}
				</div>

				<div class="mt-5 flex justify-end space-x-3">
					<button
						type="button"
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
						on:click={cancelDelete}
						disabled={isDeleting}
					>
						Cancel
					</button>
					<button
						type="button"
						class="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						on:click={deleteMeal}
						disabled={isDeleting}
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
