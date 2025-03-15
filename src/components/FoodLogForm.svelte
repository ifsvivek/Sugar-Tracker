<script>
	import { createEventDispatcher } from 'svelte';

	export let food = null;
	export let isOpen = false;

	const dispatch = createEventDispatcher();
	const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

	let servingSize = 1;
	let mealType = mealTypes[0];
	let isSubmitting = false;
	let error = null;

	async function handleSubmit() {
		if (!food) return;

		isSubmitting = true;
		error = null;

		try {
			const response = await fetch('/api/foods/log', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fdcId: food.fdcId,
					servingSize,
					mealType
				})
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to log food');
			}

			dispatch('success');
			close();
		} catch (err) {
			error = err.message;
		} finally {
			isSubmitting = false;
		}
	}

	function close() {
		servingSize = 1;
		mealType = mealTypes[0];
		error = null;
		dispatch('close');
	}
</script>

{#if isOpen && food}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div
			class="flex min-h-screen items-center justify-center px-4 py-6 text-center sm:p-0 md:py-12"
		>
			<div
				class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
				on:click={close}
				
			></div>

			<div
				class="relative inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white px-4 py-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:p-6 sm:align-middle"
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

				<div class="mb-5">
					<h3 class="text-lg font-medium text-gray-900">Log Food</h3>
					<div class="mt-3 rounded-md bg-green-50 p-3">
						<h4 class="font-medium text-gray-900">{food.description}</h4>
						{#if food.brandName}
							<p class="text-sm text-gray-600">{food.brandName}</p>
						{/if}
					</div>
				</div>

				<form on:submit|preventDefault={handleSubmit} class="space-y-4">
					<div>
						<label for="servingSize" class="block text-sm font-medium text-gray-700"
							>Serving Size</label
						>
						<div class="mt-1">
							<input
								type="number"
								id="servingSize"
								bind:value={servingSize}
								min="0.1"
								step="0.1"
								class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
								required
							/>
						</div>
					</div>

					<div>
						<label for="mealType" class="block text-sm font-medium text-gray-700">Meal Type</label>
						<div class="mt-1">
							<select
								id="mealType"
								bind:value={mealType}
								class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							>
								{#each mealTypes as type}
									<option value={type}>{type}</option>
								{/each}
							</select>
						</div>
					</div>

					{#if error}
						<div class="rounded-md bg-red-50 p-3">
							<p class="text-sm text-red-600">{error}</p>
						</div>
					{/if}

					<div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
						<button
							type="button"
							on:click={close}
							class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none active:bg-gray-100"
							disabled={isSubmitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none active:bg-green-800"
						>
							{isSubmitting ? 'Saving...' : 'Save'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
