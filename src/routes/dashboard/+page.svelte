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
		WeeklyTrends,
		QuickAddFood,
		RecentEntries,
		SugarTip,
		TabNavigation
	} from '$components';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Get user data from the server
	$: userName = data.user?.name || 'User';
	$: foodLogs = data.foodLogs || [];
	$: todayLogs = data.todayLogs || [];
	$: today = data.today ? new Date(data.today).toISOString().split('T')[0] : '';
	$: goals = data.goals || [];

	// Get today's nutrition data - resets at the end of each day
	$: totalSugar = data.totalSugar || 0;
	$: totalCarbs = data.totalCarbs || 0;
	$: totalProtein = data.totalProtein || 0;
	$: totalFat = data.totalFat || 0;
	$: totalFiber = data.totalFiber || 0;

	$: sugarGoal = data.sugarGoal || 25;
	$: sugarPercentage = Math.round((totalSugar / sugarGoal) * 100);
	$: sugarExceeded = totalSugar > sugarGoal;

	// Group meals by date
	$: mealsByDate = groupMealsByDate(foodLogs);
	$: recentDates = [...Object.keys(mealsByDate)].sort((a, b) => new Date(b) - new Date(a));

	// Calculate nutrient percentages based on goals
	$: nutritionData = [
		{
			id: 1,
			name: 'Sugar',
			value: `${totalSugar}g`,
			goal: `${sugarGoal}g`,
			percentage: Math.round((totalSugar / sugarGoal) * 100),
			exceeded: totalSugar > sugarGoal
		},
		{
			id: 2,
			name: 'Carbs',
			value: `${totalCarbs}g`,
			goal: getGoalForNutrient(2, 150),
			percentage: Math.round((totalCarbs / getGoalAmountForNutrient(2, 150)) * 100),
			exceeded: isGoalExceeded(2, totalCarbs)
		},
		{
			id: 3,
			name: 'Protein',
			value: `${totalProtein}g`,
			goal: getGoalForNutrient(3, 60),
			percentage: Math.round((totalProtein / getGoalAmountForNutrient(3, 60)) * 100),
			exceeded: isGoalExceeded(3, totalProtein)
		},
		{
			id: 4,
			name: 'Fat',
			value: `${totalFat}g`,
			goal: getGoalForNutrient(4, 50),
			percentage: Math.round((totalFat / getGoalAmountForNutrient(4, 50)) * 100),
			exceeded: isGoalExceeded(4, totalFat)
		},
		{
			id: 5,
			name: 'Fiber',
			value: `${totalFiber}g`,
			goal: getGoalForNutrient(5, 25),
			percentage: Math.round((totalFiber / getGoalAmountForNutrient(5, 25)) * 100),
			exceeded: isGoalExceeded(5, totalFiber)
		}
	];

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
		showGoalModal = false;
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
			5: 25 // Fiber
		};
		return defaultValues[nutrientId] || 0;
	}

	// Helper functions
	function groupMealsByDate(meals) {
		const groups = {};

		meals.forEach((meal) => {
			const date = new Date(meal.consumed_at);
			// Use ISO format date string (YYYY-MM-DD) for consistent storage
			const dateStr = date.toISOString().split('T')[0];

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
		// Create date from ISO format string (YYYY-MM-DD)
		const date = new Date(dateStr + 'T00:00:00');
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === yesterday.toDateString()) {
			return 'Yesterday';
		} else {
			// Explicitly format with separate day and month to avoid confusion
			const month = date.toLocaleString('en-US', { month: 'short' });
			const day = date.getDate();
			const weekday = date.toLocaleString('en-US', { weekday: 'short' });
			const year = date.getFullYear() !== today.getFullYear() ? `, ${date.getFullYear()}` : '';

			return `${weekday}, ${month} ${day}${year}`;
		}
	}

	// State management
	let isLoading = true;
	let showGoalModal = false;
	let activeTab = 'today';

	// Sample data (replace with actual data fetching)
	let userData = {
		name: 'User',
		dailyGoals: [
			{
				nutrient_id: 1,
				name: 'Sugar',
				unit: 'g',
				target_amount: 25,
				is_minimum: false,
				current: 18
			},
			{
				nutrient_id: 2,
				name: 'Carbs',
				unit: 'g',
				target_amount: 150,
				is_minimum: false,
				current: 95
			},
			{
				nutrient_id: 3,
				name: 'Protein',
				unit: 'g',
				target_amount: 60,
				is_minimum: true,
				current: 45
			},
			{ nutrient_id: 4, name: 'Fat', unit: 'g', target_amount: 50, is_minimum: false, current: 30 }
		],
		recentEntries: [
			{ id: 1, name: 'Oatmeal', time: '7:30 AM', sugar: 1.1, calories: 158 },
			{ id: 2, name: 'Apple', time: '10:15 AM', sugar: 10.4, calories: 72 },
			{ id: 3, name: 'Chicken Salad', time: '12:30 PM', sugar: 3.2, calories: 350 },
			{ id: 4, name: 'Greek Yogurt', time: '3:45 PM', sugar: 5.0, calories: 100 }
		],
		weeklyTrend: {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			sugarData: [22, 19, 27, 23, 18, 12, 18],
			calorieData: [1800, 1950, 2100, 1850, 1700, 2200, 1900]
		},
		todaySummary: {
			calories: 680,
			sugar: 18,
			carbs: 95,
			protein: 45,
			fat: 30
		}
	};

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

	// Calculate percentage of goal reached
	function calculateProgress(current, target, isMinimum) {
		if (isMinimum) {
			return Math.min(100, Math.round((current / target) * 100));
		} else {
			return Math.min(100, Math.round((current / target) * 100));
		}
	}

	// Tab switching
	function setActiveTab(tab) {
		activeTab = tab;
	}

	// Process food logs for weekly trends visualization with comprehensive data
	$: weeklyTrendsData = processLogsForWeeklyTrends(foodLogs);

	// Function to process food logs for weekly trends
	function processLogsForWeeklyTrends(logs) {
		// Get dates for past 7 days
		const dates = [];
		const sugarData = [];
		const calorieData = [];
		const carbsData = [];
		const proteinData = [];
		const fatData = [];
		const fiberData = [];
		const labels = [];

		// Create date objects for the past 7 days
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			date.setHours(0, 0, 0, 0);
			dates.push(date);
		}

		// Format dates to match log dates (YYYY-MM-DD)
		const formattedDates = dates.map(d => d.toISOString().split('T')[0]);
		
		// Create day labels (Mon, Tue, etc.)
		labels.push(...dates.map(d => d.toLocaleDateString('en-US', { weekday: 'short' })));

		// Group logs by date
		const logsByDate = {};
		logs.forEach(log => {
			const date = new Date(log.consumed_at);
			const dateStr = date.toISOString().split('T')[0];
			
			if (!logsByDate[dateStr]) {
				logsByDate[dateStr] = [];
			}
			
			logsByDate[dateStr].push(log);
		});

		// Calculate nutrient values for each day
		formattedDates.forEach(date => {
			const dayLogs = logsByDate[date] || [];
			const daySugar = calculateNutrientTotal(dayLogs, 1);
			const dayCarbs = calculateNutrientTotal(dayLogs, 2);
			const dayProtein = calculateNutrientTotal(dayLogs, 3);
			const dayFat = calculateNutrientTotal(dayLogs, 4);
			const dayFiber = calculateNutrientTotal(dayLogs, 5);
			
			// Calculate calories from macronutrients
			const dayCalories = Math.round(dayCarbs * 4 + dayProtein * 4 + dayFat * 9);
			
			sugarData.push(daySugar);
			calorieData.push(dayCalories);
			carbsData.push(dayCarbs);
			proteinData.push(dayProtein);
			fatData.push(dayFat);
			fiberData.push(dayFiber);
		});

		// Get nutrient consumption by meal type using actual data
		const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
		const mealBreakdown = mealTypes.map(type => {
			const mealLogs = logs.filter(log => log.meal_type?.toLowerCase() === type);
			const sugar = calculateNutrientTotal(mealLogs, 1);
			return {
				name: type.charAt(0).toUpperCase() + type.slice(1),
				sugar: sugar,
				percentage: 0 // Will calculate after summing all
			};
		});

		// Calculate percentages for meal breakdown
		const totalMealSugar = mealBreakdown.reduce((sum, meal) => sum + meal.sugar, 0);
		mealBreakdown.forEach(meal => {
			meal.percentage = totalMealSugar > 0 
				? Math.round((meal.sugar / totalMealSugar) * 100)
				: 0;
		});
		
		// Calculate monthly trend data based on real data
		const monthlyTrend = calculateMonthlyTrend(logs);

		return {
			labels,
			sugarData,
			calorieData,
			carbsData,
			proteinData,
			fatData,
			fiberData,
			mealBreakdown,
			monthlyTrend,
			dailyNutrients: formattedDates.map((date, i) => ({
				date,
				sugar: sugarData[i],
				carbs: carbsData[i],
				protein: proteinData[i],
				fat: fatData[i],
				fiber: fiberData[i],
				calories: calorieData[i]
			}))
		};
	}
	
	// Calculate monthly comparison data
	function calculateMonthlyTrend(logs) {
		// Get dates for the current month and previous month
		const today = new Date();
		const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
		const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
		
		// Filter logs for current and previous month
		const currentMonthLogs = logs.filter(log => {
			const logDate = new Date(log.consumed_at);
			return logDate >= currentMonthStart && logDate < today;
		});
		
		const previousMonthLogs = logs.filter(log => {
			const logDate = new Date(log.consumed_at);
			return logDate >= previousMonthStart && logDate < currentMonthStart;
		});
		
		// Calculate average sugar for both months
		const currentMonthSugar = currentMonthLogs.length > 0 
			? calculateNutrientTotal(currentMonthLogs, 1) / Math.max(1, calculateDaySpan(currentMonthLogs))
			: 0;
			
		const previousMonthSugar = previousMonthLogs.length > 0 
			? calculateNutrientTotal(previousMonthLogs, 1) / Math.max(1, calculateDaySpan(previousMonthLogs))
			: 0;
		
		// Calculate percent change
		const percentChange = previousMonthSugar > 0 
			? Math.round(((previousMonthSugar - currentMonthSugar) / previousMonthSugar) * 100)
			: 0;
			
		return {
			currentMonthAvg: Math.round(currentMonthSugar * 10) / 10,
			previousMonthAvg: Math.round(previousMonthSugar * 10) / 10,
			percentChange,
			hasData: currentMonthLogs.length > 0 || previousMonthLogs.length > 0
		};
	}
	
	// Helper to calculate days spanned by logs
	function calculateDaySpan(logs) {
		if (!logs || logs.length === 0) return 1;
		
		const dates = logs.map(log => new Date(log.consumed_at).toISOString().split('T')[0]);
		const uniqueDates = new Set(dates);
		return uniqueDates.size;
	}

	// Initialize dashboard
	onMount(() => {
		// Simulate data loading
		setTimeout(() => {
			isLoading = false;
		}, 500);

		// Here you would fetch actual user data, goals, and entries
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
			<!-- Summary Cards -->
			<div class="col-span-1 overflow-hidden rounded-xl bg-white shadow-md lg:col-span-2">
				<TabNavigation {activeTab} onTabChange={setActiveTab} />

				{#if isLoading}
					<div class="flex h-64 items-center justify-center">
						<div
							class="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
						></div>
					</div>
				{:else if activeTab === 'today'}
					<NutritionOverview {nutritionData} {totalCarbs} {totalProtein} {totalFat} />
					<FoodLogTable {todayLogs} {getNutrientAmount} />
				{:else if activeTab === 'trends'}
					<WeeklyTrends
						weeklyData={weeklyTrendsData}
						{foodLogs}
						{totalSugar}
						{sugarGoal}
						{totalCarbs}
						{totalProtein}
						{totalFat}
						{totalFiber}
					/>
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

<!-- Goal Settings Modal - removed duplicate -->
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
