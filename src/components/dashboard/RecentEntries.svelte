<script>
  export let foodLogs = [];
  export let isLoading = false;
  export let onAddClick = () => {};
  
  // Helper function
  export let getNutrientAmount = (nutrients, nutrientId) => {
    if (!Array.isArray(nutrients)) return 0;
    const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
    return nutrient ? Math.round(nutrient.amount * 10) / 10 : 0;
  };
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-md">
  <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Recent Entries</h3>
      <button
        on:click={onAddClick}
        class="text-sm font-medium text-green-600 hover:text-green-700 hover:underline focus:outline-none"
      >
        Add more
      </button>
    </div>
  </div>

  {#if isLoading}
    <div class="flex h-40 items-center justify-center">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
      ></div>
    </div>
  {:else}
    <ul class="divide-y divide-gray-200">
      {#if foodLogs && foodLogs.length}
        {#each foodLogs.slice(0, 5) as log}
          <li class="px-6 py-4 transition-colors duration-150 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{log.food_name}</p>
                <p class="text-sm text-gray-500">
                  {new Date(log.consumed_at).toLocaleDateString()} ·
                  {log.meal_type?.charAt(0).toUpperCase() + log.meal_type?.slice(1) || 'Meal'}
                </p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">
                  {(getNutrientAmount(log.nutrients, 1) * log.serving_size).toFixed(1)}g sugar
                </p>
                <p class="text-sm text-gray-500">
                  {log.serving_size} serving{log.serving_size !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </li>
        {/each}
      {:else}
        <li class="px-6 py-8 text-center">
          <p class="text-gray-500">No entries yet</p>
          <p class="mt-1 text-sm text-gray-400">Start logging your food to see it here</p>
        </li>
      {/if}
    </ul>
  {/if}
</div>
