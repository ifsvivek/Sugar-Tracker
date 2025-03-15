<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { FoodSearchModal, FoodLogForm, QuickAddFood } from '$components';
	import { onMount } from 'svelte';

	// State management
	let isLoading = true;
	let isSearchModalOpen = false;
	let isFoodLogFormOpen = false;
	let selectedFood = null;

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

	function handleFoodSelect(event) {
		selectedFood = event.detail.food;
		isFoodLogFormOpen = true;
	}

	function handleLogSuccess() {
		// Redirect to dashboard after successful log
		window.location.href = '/';
	}

	onMount(() => {
		setTimeout(() => {
			isLoading = false;
			// Automatically open search modal if no params
			if (!window.location.search) {
				isSearchModalOpen = true;
			}
		}, 300);
	});
</script>

<svelte:head>
	<title>Log Food | Sugar Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-12">
	<div class="bg-gradient-to-r from-green-600 to-teal-500 pb-16 shadow-md md:pb-20">
		<div class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-2xl font-bold text-white sm:text-3xl md:text-4xl">Log Your Food</h1>
				<p class="mt-2 text-white opacity-90">Track what you eat to stay accountable</p>
			</div>
		</div>
	</div>

	<!-- Log Food Content -->
	<div class="mx-auto -mt-12 max-w-3xl px-4 sm:px-6 lg:px-8">
		<div class="rounded-lg bg-white p-6 shadow-md">
			<div class="mb-8">
				<h2 class="text-lg font-medium text-gray-900">Quick Add Food</h2>
				<p class="mt-1 text-sm text-gray-500">Record your food intake</p>
			</div>

			{#if isLoading}
				<div class="flex h-40 items-center justify-center">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
					></div>
				</div>
			{:else}
				<div class="space-y-6">
					<!-- Quick Add Form -->
					<QuickAddFood
						onSubmit={handleQuickAdd}
						onSearchClick={() => (isSearchModalOpen = true)}
						{quickAddForm}
					/>

					<!-- Search from database section -->
					<div class="mt-8 rounded-md bg-gray-50 p-4">
						<div class="flex flex-col items-center justify-center text-center">
							<h3 class="text-base font-medium text-gray-900">
								Can't find what you're looking for?
							</h3>
							<p class="mt-1 text-sm text-gray-500">
								Search our database of thousands of food items
							</p>
							<button
								type="button"
								on:click={() => (isSearchModalOpen = true)}
								class="mt-3 inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
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
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								Search Food Database
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Modals for Food Entry -->
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
