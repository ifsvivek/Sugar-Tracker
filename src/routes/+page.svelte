<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import {
		FoodSearchModal,
		FoodLogForm,
		GoalSettingsModal,
		DeleteConfirmationModal,
		// Import dashboard components
		DashboardHeader,
		NutritionOverview,
		FoodLogTable,
		QuickAddFood,
		RecentEntries,
		SugarTip
	} from '$components';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Get user data from the parent (layout) data via page data
	$: user = $page.data.user;
	$: userName = user?.name || 'User';
	$: foodLogs = data.foodLogs || [];
	$: todayLogs = data.todayLogs || [];
	$: goals = data.goals || [];

	// Get today's nutrition data
	$: totalSugar = data.totalSugar || 0;
	$: totalCarbs = data.totalCarbs || 0;
	$: totalProtein = data.totalProtein || 0;
	$: totalFat = data.totalFat || 0;
	$: totalFiber = data.totalFiber || 0;
	$: totalSodium = data.totalSodium || 0;

	$: sugarGoal = data.sugarGoal || 25;
	$: sugarPercentage = Math.round((totalSugar / sugarGoal) * 100);

	// Calculate nutrient percentages based on goals
	$: nutritionData = [
		{
			id: 1,
			name: 'Sugar',
			value: `${totalSugar.toFixed(1)}g`,
			goal: `${sugarGoal}g`,
			percentage: Math.round((totalSugar / sugarGoal) * 100),
			exceeded: totalSugar > sugarGoal
		},
		{
			id: 2,
			name: 'Carbs',
			value: `${totalCarbs.toFixed(1)}g`,
			goal: getGoalForNutrient(2, 150),
			percentage: Math.round((totalCarbs / getGoalAmountForNutrient(2, 150)) * 100),
			exceeded: isGoalExceeded(2, totalCarbs)
		},
		{
			id: 3,
			name: 'Protein',
			value: `${totalProtein.toFixed(1)}g`,
			goal: getGoalForNutrient(3, 60),
			percentage: Math.round((totalProtein / getGoalAmountForNutrient(3, 60)) * 100),
			exceeded: isGoalExceeded(3, totalProtein)
		},
		{
			id: 4,
			name: 'Fat',
			value: `${totalFat.toFixed(1)}g`,
			goal: getGoalForNutrient(4, 50),
			percentage: Math.round((totalFat / getGoalAmountForNutrient(4, 50)) * 100),
			exceeded: isGoalExceeded(4, totalFat)
		},
		{
			id: 5,
			name: 'Fiber',
			value: `${totalFiber.toFixed(1)}g`,
			goal: getGoalForNutrient(5, 25),
			percentage: Math.round((totalFiber / getGoalAmountForNutrient(5, 25)) * 100),
			exceeded: isGoalExceeded(5, totalFiber)
		},
		{
			id: 6,
			name: 'Sodium',
			value: `${totalSodium}mg`,
			goal: getGoalForNutrient(6, 2300),
			percentage: Math.round((totalSodium / getGoalAmountForNutrient(6, 2300)) * 100),
			exceeded: isGoalExceeded(6, totalSodium)
		}
	];

	// Remove additionalNutrients

	// Modals state
	let isSearchModalOpen = false;
	let isFoodLogFormOpen = false;
	let isGoalSettingsModalOpen = false;
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

	function openGoalSettings() {
		isGoalSettingsModalOpen = true;
	}

	function handleGoalSuccess() {
		window.location.reload();
	}

	// Helper functions for nutrition goals
	function getGoalForNutrient(nutrientId, defaultAmount) {
		const goal = goals.find((g) => g.nutrient_id === nutrientId);
		return goal ? `${goal.target_amount}${goal.unit}` : `${defaultAmount}g`;
	}

	function getGoalAmountForNutrient(nutrientId, defaultAmount) {
		const goal = goals.find((g) => g.nutrient_id === nutrientId);
		return goal ? goal.target_amount : defaultAmount;
	}

	function isGoalExceeded(nutrientId, amount) {
		const goal = goals.find((g) => g.nutrient_id === nutrientId);
		if (!goal) return amount > getDefaultGoalForNutrient(nutrientId);

		// If it's a minimum goal, we only exceed if below the target
		if (goal.is_minimum) {
			return amount < goal.target_amount;
		}

		// Otherwise it's a maximum goal
		return amount > goal.target_amount;
	}

	function getDefaultGoalForNutrient(nutrientId) {
		const defaultValues = {
			1: 25, // Sugar
			2: 150, // Carbs
			3: 60, // Protein
			4: 50, // Fat
			5: 25, // Fiber
			6: 2300 // Sodium
		};
		return defaultValues[nutrientId] || 0;
	}

	function getNutrientAmount(nutrients, nutrientId) {
		if (!Array.isArray(nutrients)) return 0;
		const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
		return nutrient ? Math.round(nutrient.amount * 10) / 10 : 0;
	}

	// State management
	let isLoading = true;
	let showGoalModal = false;

	// Quick add food form
	let quickAddForm = {
		foodName: '',
		servingSize: 1,
		mealType: 'breakfast',
		sugarAmount: ''
	};

	function handleQuickAdd() {
		// Implement food logging logic
		alert('Food added: ' + quickAddForm.foodName);
		quickAddForm.foodName = '';
		quickAddForm.servingSize = 1;
	}

	// Initialize for mobile navigation
	onMount(() => {
		// Simulate data loading
		setTimeout(() => {
			isLoading = false;
		}, 500);
	});

	function openGoalModal() {
		showGoalModal = true;
	}
</script>

<svelte:head>
	<title>Dashboard | Sugar Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-12">
	<!-- Dashboard Header -->
	<DashboardHeader
		{userName}
		{isLoading}
		onActionClick={openGoalModal}
		actionText="Set Nutrition Goals"
	/>

	<!-- Dashboard Content -->
	<div class="mx-auto -mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Main Grid Layout -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="col-span-1 overflow-hidden rounded-xl bg-white shadow-md lg:col-span-2">
				{#if isLoading}
					<div class="flex h-64 items-center justify-center">
						<div
							class="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
						></div>
					</div>
				{:else}
					<div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
						<h3 class="text-lg leading-6 font-medium text-gray-900">Today's Food Log</h3>
						<p class="mt-1 text-sm text-gray-500">Track your daily nutrition intake</p>
					</div>
					<NutritionOverview 
						{nutritionData} 
						{totalCarbs} 
						{totalProtein} 
						{totalFat} 
						{totalSodium}
					/>
					<FoodLogTable {todayLogs} {getNutrientAmount} />
				{/if}
			</div>

			<!-- Quick Add & Recent Entries -->
			<div class="col-span-1 space-y-6">
				<!-- Quick Add Food Card -->
				<QuickAddFood
					onSubmit={handleQuickAdd}
					onSearchClick={() => (isSearchModalOpen = true)}
					{quickAddForm}
				/>

				<!-- Recent Entries -->
				<RecentEntries
					{foodLogs}
					{isLoading}
					onAddClick={() => (isSearchModalOpen = true)}
					{getNutrientAmount}
				/>

				<!-- Tips Card -->
				<SugarTip {totalSugar} {sugarGoal} />
			</div>
		</div>
	</div>
</div>

<!-- Modals - ensure no duplicates -->
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

<!-- Goal Settings Modal -->
<GoalSettingsModal
	isOpen={showGoalModal || isGoalSettingsModalOpen}
	currentGoals={goals}
	on:close={() => {
		showGoalModal = false;
		isGoalSettingsModalOpen = false;
	}}
	on:success={handleGoalSuccess}
/>

<!-- Delete Confirmation Modal -->
<DeleteConfirmationModal
	isOpen={isDeleteConfirmOpen}
	item={mealToDelete}
	{isDeleting}
	title="Delete Food Log"
	on:cancel={cancelDelete}
	on:confirm={deleteMeal}
/>
