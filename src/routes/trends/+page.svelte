<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { WeeklyTrends } from '$components';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Get user data from the parent (layout) data via page data
	$: user = $page.data.user;
	$: userName = user?.name || 'User';
	$: foodLogs = data.foodLogs || [];
	$: weeklyData = data.weeklyData || {
		labels: [],
		sugarData: [],
		calorieData: [],
		carbsData: [],
		proteinData: [],
		fatData: [],
		fiberData: [],
		mealBreakdown: [],
		dailyNutrients: []
	};

	// Get nutrition data
	$: totalSugar = data.totalSugar || 0;
	$: totalCarbs = data.totalCarbs || 0;
	$: totalProtein = data.totalProtein || 0;
	$: totalFat = data.totalFat || 0;
	$: totalFiber = data.totalFiber || 0;
	$: sugarGoal = data.sugarGoal || 25;

	// Check if we have data to display
	$: hasData = weeklyData.dailyNutrients.some(day => 
		day.sugar > 0 || day.carbs > 0 || day.protein > 0 || day.fat > 0
	);

	// State management
	let isLoading = true;

	onMount(() => {
		setTimeout(() => {
			isLoading = false;
		}, 300);
	});
</script>

<svelte:head>
	<title>Trends | Sugar Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-12">
	<div class="bg-gradient-to-r from-green-600 to-teal-500 pb-16 shadow-md md:pb-20">
		<div class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-2xl font-bold text-white sm:text-3xl md:text-4xl">Nutrition Trends</h1>
				<p class="mt-2 text-white opacity-90">Track your progress and identify patterns</p>
			</div>
		</div>
	</div>

	<!-- Trends Content -->
	<div class="mx-auto -mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white shadow-md">
			{#if isLoading}
				<div class="flex h-64 items-center justify-center">
						<div class="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
				</div>
			{:else if !hasData}
				<div class="flex flex-col items-center justify-center p-10">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
					</svg>
					<h3 class="mt-4 text-lg font-medium text-gray-700">No nutrition data yet</h3>
					<p class="mt-2 text-center text-gray-500">Start logging your food to see your nutrition trends</p>
					<a href="/log" class="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
						Log Food
					</a>
				</div>
			{:else}
				<WeeklyTrends
					{weeklyData}
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
	</div>
</div>
