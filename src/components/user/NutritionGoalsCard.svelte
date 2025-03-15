<script>
	import { createEventDispatcher } from 'svelte';

	export let isLoading = false;
	export let goals = [];

	const dispatch = createEventDispatcher();

	function openGoalsModal() {
		dispatch('openGoalsModal');
	}
</script>

<div class="rounded-lg bg-white p-6 shadow-md">
	<div class="border-b border-gray-200 pb-4">
		<h2 class="text-lg leading-6 font-medium text-gray-900">Nutrition Goals</h2>
		<p class="mt-1 text-sm text-gray-500">Customize your daily nutrient targets</p>
	</div>

	{#if isLoading}
		<div class="flex h-32 items-center justify-center">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
			></div>
		</div>
	{:else}
		<div class="mt-6 space-y-4">
			{#if goals && goals.length}
				<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
					{#each goals as goal (goal.nutrient_id)}
						<div class="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
							<h3 class="font-medium text-gray-900">{goal.name}</h3>
							<div class="mt-1 flex items-center justify-between">
								<span class="text-sm text-gray-600">{goal.is_minimum ? 'Min' : 'Max'}:</span>
								<span class="font-medium">{goal.target_amount} {goal.unit}</span>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="p-4 text-center">
					<p class="text-gray-500">No nutrition goals set yet</p>
				</div>
			{/if}

			<div class="flex justify-end">
				<button
					type="button"
					on:click={openGoalsModal}
					class="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-1.5 h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
						/>
					</svg>
					{goals && goals.length ? 'Update Goals' : 'Set Goals'}
				</button>
			</div>
		</div>
	{/if}
</div>
