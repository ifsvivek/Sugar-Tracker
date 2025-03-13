<script>
  export let totalSugar = 0;
  export let sugarGoal = 25;
</script>

<div
  class="overflow-hidden rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-teal-50 shadow-md"
>
  <div class="p-6">
    <div class="flex items-center">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="ml-3 text-lg font-medium text-gray-900">Sugar Tip</h3>
    </div>
    <p class="mt-4 text-gray-600">
      {#if totalSugar > sugarGoal}
        You've exceeded your daily sugar goal. Try replacing sugary snacks with fruits or nuts
        to reduce your intake.
      {:else}
        Try swapping regular soda for sparkling water with a splash of fruit juice to reduce
        your sugar intake by up to 40g per day.
      {/if}
    </p>
  </div>
</div>
