<script>
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;
	export let currentGoals = [];
	export let availableNutrients = [
		{ id: 1, name: 'Sugar', unit: 'g', default: 25 },
		{ id: 2, name: 'Carbohydrates', unit: 'g', default: 150 },
		{ id: 3, name: 'Protein', unit: 'g', default: 60 },
		{ id: 4, name: 'Fat', unit: 'g', default: 50 },
		{ id: 5, name: 'Fiber', unit: 'g', default: 25 },
		{ id: 6, name: 'Sodium', unit: 'mg', default: 2300 },
		{ id: 7, name: 'Cholesterol', unit: 'mg', default: 300 },
		{ id: 8, name: 'Vitamin A', unit: 'IU', default: 5000 },
		{ id: 9, name: 'Vitamin C', unit: 'mg', default: 90 },
		{ id: 10, name: 'Calcium', unit: 'mg', default: 1000 },
		{ id: 11, name: 'Iron', unit: 'mg', default: 18 }
	];

	const dispatch = createEventDispatcher();

	// Function to close modal
	function closeModal() {
		dispatch('close');
	}

	// Handle overlay click
	function handleOverlayClick(event) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	// Initialize goals based on current goals or defaults
	$: goals = availableNutrients.map((nutrient) => {
		const currentGoal = currentGoals.find((goal) => goal.nutrient_id === nutrient.id);
		return {
			nutrient_id: nutrient.id,
			name: nutrient.name,
			unit: nutrient.unit,
			target_amount: currentGoal ? currentGoal.target_amount : nutrient.default,
			is_minimum: currentGoal ? currentGoal.is_minimum : false
		};
	});

	// Save goals
	async function saveGoals() {
		try {
			const response = await fetch('/api/goals', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ goals })
			});

			if (!response.ok) {
				throw new Error('Failed to save goals');
			}

			dispatch('success');
			closeModal();
		} catch (error) {
			console.error('Error saving goals:', error);
		}
	}

	// Update a goal value
	function updateGoalValue(id, value) {
		goals = goals.map((goal) =>
			goal.nutrient_id === id ? { ...goal, target_amount: parseFloat(value) || 0 } : goal
		);
	}

	// Toggle minimum/maximum
	function toggleMinimum(id) {
		goals = goals.map((goal) =>
			goal.nutrient_id === id ? { ...goal, is_minimum: !goal.is_minimum } : goal
		);
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-screen items-center justify-center px-4 py-6 text-center md:py-12">
			<!-- Overlay -->
			<div
				class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
				on:click={handleOverlayClick}
				on:keydown={(e) => e.key === 'Escape' && closeModal()}
				role="button"
				tabindex="0"
				aria-label="Close modal"
			></div>

			<!-- Modal -->
			<div
				class="inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all md:p-6"
			>
				<div class="mb-4">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-medium text-gray-900">Set Nutrition Goals</h3>
						<button
							on:click={closeModal}
							class="rounded-full bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none active:bg-gray-200"
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
					<p class="mt-2 text-xs text-gray-500 md:text-sm">
						Customize your daily nutrition targets to help meet your health objectives.
					</p>
				</div>

				<div class="mt-4 max-h-80 space-y-4 overflow-y-auto pr-1 md:max-h-96">
					<!-- Primary nutrients -->
					<div class="mb-3 border-b border-gray-200 pb-2">
						<h4 class="text-sm font-medium text-gray-700">Primary Nutrients</h4>
					</div>
					{#each goals.filter(goal => goal.nutrient_id <= 6) as goal (goal.nutrient_id)}
						<div class="flex flex-col space-y-2 border-b border-gray-100 pb-3 last:border-0">
							<label class="flex items-center justify-between">
								<span class="font-medium text-gray-700">{goal.name} ({goal.unit})</span>
								<div class="flex items-center">
									<span class="mr-2 text-xs text-gray-500 md:text-sm">
										{goal.is_minimum ? 'Minimum' : 'Maximum'}
									</span>
									<button
										type="button"
										class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none md:h-6 md:w-11"
										class:bg-green-600={goal.is_minimum}
										on:click={() => toggleMinimum(goal.nutrient_id)}
										aria-label={goal.is_minimum
											? `Set ${goal.name} to maximum`
											: `Set ${goal.name} to minimum`}
									>
										<span
											class="pointer-events-none inline-block h-4 w-4 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out md:h-5 md:w-5"
											class:translate-x-5={goal.is_minimum}
										></span>
									</button>
								</div>
							</label>
							<div class="flex items-center space-x-3">
								<input
									type="number"
									min="0"
									step="1"
									class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
									value={goal.target_amount}
									on:input={(e) => updateGoalValue(goal.nutrient_id, e.target.value)}
								/>
								<span class="text-sm font-medium text-gray-500">{goal.unit}</span>
							</div>
						</div>
					{/each}
					
					<!-- Additional nutrients -->
					<div class="mb-3 mt-6 border-b border-gray-200 pb-2">
						<h4 class="text-sm font-medium text-gray-700">Additional Nutrients</h4>
					</div>
					{#each goals.filter(goal => goal.nutrient_id > 6) as goal (goal.nutrient_id)}
						<div class="flex flex-col space-y-2 border-b border-gray-100 pb-3 last:border-0">
							<label class="flex items-center justify-between">
								<span class="font-medium text-gray-700">{goal.name} ({goal.unit})</span>
								<div class="flex items-center">
									<span class="mr-2 text-xs text-gray-500 md:text-sm">
										{goal.is_minimum ? 'Minimum' : 'Maximum'}
									</span>
									<button
										type="button"
										class="relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none md:h-6 md:w-11"
										class:bg-green-600={goal.is_minimum}
										on:click={() => toggleMinimum(goal.nutrient_id)}
										aria-label={goal.is_minimum
											? `Set ${goal.name} to maximum`
											: `Set ${goal.name} to minimum`}
									>
										<span
											class="pointer-events-none inline-block h-4 w-4 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out md:h-5 md:w-5"
											class:translate-x-5={goal.is_minimum}
										></span>
									</button>
								</div>
							</label>
							<div class="flex items-center space-x-3">
								<input
									type="number"
									min="0"
									step="1"
									class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
									value={goal.target_amount}
									on:input={(e) => updateGoalValue(goal.nutrient_id, e.target.value)}
								/>
								<span class="text-sm font-medium text-gray-500">{goal.unit}</span>
							</div>
						</div>
					{/each}
				</div>

				<div class="mt-5 flex justify-end space-x-3">
					<button
						type="button"
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none active:bg-gray-100"
						on:click={closeModal}
					>
						Cancel
					</button>
					<button
						type="button"
						class="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none active:bg-green-800"
						on:click={saveGoals}
					>
						Save Goals
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
