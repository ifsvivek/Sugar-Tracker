<script>
  export let todayLogs = [];
  
  // Helper function to extract nutrient amount
  export let getNutrientAmount = (nutrients, nutrientId) => {
    if (!Array.isArray(nutrients)) return 0;
    const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
    return nutrient ? Math.round(nutrient.amount * 10) / 10 : 0;
  };
</script>

<div>
  <h4 class="mb-4 text-sm font-medium text-gray-900">Today's Logs</h4>

  {#if todayLogs && todayLogs.length > 0}
    <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Food</th
            >
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Time</th
            >
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
              >Sugar</th
            >
            <th
              scope="col"
              class="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:table-cell"
              >Carbs</th
            >
            <th
              scope="col"
              class="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase sm:table-cell"
              >Protein</th
            >
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each todayLogs.slice(0, 4) as log}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm font-medium whitespace-nowrap text-gray-900"
                >{log.food_name}</td
              >
              <td class="px-4 py-2 text-sm whitespace-nowrap text-gray-500">
                {new Date(log.consumed_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td class="px-4 py-2 text-sm whitespace-nowrap text-gray-500"
                >{(getNutrientAmount(log.nutrients, 1) * log.serving_size).toFixed(
                  1
                )}g</td
              >
              <td
                class="hidden px-4 py-2 text-sm whitespace-nowrap text-gray-500 sm:table-cell"
                >{(getNutrientAmount(log.nutrients, 2) * log.serving_size).toFixed(
                  1
                )}g</td
              >
              <td
                class="hidden px-4 py-2 text-sm whitespace-nowrap text-gray-500 sm:table-cell"
                >{(getNutrientAmount(log.nutrients, 3) * log.serving_size).toFixed(
                  1
                )}g</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="rounded-lg bg-gray-50 py-8 text-center">
      <p class="text-gray-500">No food logged today</p>
      <p class="mt-2 text-sm text-gray-400">
        Add your first meal using the quick add form
      </p>
    </div>
  {/if}
</div>
