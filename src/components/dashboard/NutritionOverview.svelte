<script>
  export let nutritionData = [];
  export let totalCarbs = 0;
  export let totalProtein = 0;
  export let totalFat = 0;
</script>

<div class="p-6">
  <div class="mb-6 flex flex-wrap items-center justify-between">
    <h3 class="text-lg font-medium text-gray-900">Nutrition Overview</h3>
    <span
      class="rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800"
    >
      {#if nutritionData && nutritionData.length}
        {Math.round(totalCarbs * 4 + totalProtein * 4 + totalFat * 9)} calories today
      {:else}
        0 calories today
      {/if}
    </span>
  </div>

  <!-- Nutrition Goals Progress -->
  <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
    {#each nutritionData as item}
      <div
        class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div class="mb-2 flex items-center justify-between">
          <span class="font-medium text-gray-900">{item.name}</span>
          <span class="text-sm font-medium text-gray-700">
            {item.value} / {item.goal}
          </span>
        </div>
        <div class="relative mb-2 h-4 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            class={`absolute top-0 left-0 h-full rounded-full ${
              item.exceeded
                ? item.name === 'Protein'
                  ? 'bg-orange-500'
                  : 'bg-red-500'
                : item.name === 'Protein'
                  ? 'bg-green-500'
                  : 'bg-blue-500'
            }`}
            style={`width: ${Math.min(item.percentage, 100)}%`}
          ></div>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">
            {item.name === 'Protein' ? 'Minimum target' : 'Maximum limit'}
          </p>
          <p
            class={`text-xs font-medium ${item.exceeded ? (item.name === 'Protein' ? 'text-orange-600' : 'text-red-600') : 'text-green-600'}`}
          >
            {item.percentage}%
          </p>
        </div>
      </div>
    {/each}
  </div>
</div>
