<script>
  export let onSubmit = () => {};
  export let onSearchClick = () => {};
  
  // Form data
  export let quickAddForm = {
    foodName: '',
    servingSize: 1,
    mealType: 'breakfast',
    sugarAmount: ''
  };
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-md">
  <div class="bg-green-600 px-6 py-4">
    <h3 class="text-lg font-medium text-white">Quick Add Food</h3>
  </div>
  <div class="p-6">
    <form on:submit|preventDefault={onSubmit}>
      <div class="mb-4">
        <label for="food-name" class="block text-sm font-medium text-gray-700"
          >Food Name</label
        >
        <input
          type="text"
          id="food-name"
          bind:value={quickAddForm.foodName}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="e.g., Apple"
        />
      </div>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label for="serving-size" class="block text-sm font-medium text-gray-700"
            >Servings</label
          >
          <input
            type="number"
            id="serving-size"
            bind:value={quickAddForm.servingSize}
            min="0.25"
            step="0.25"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="meal-type" class="block text-sm font-medium text-gray-700">Meal</label>
          <select
            id="meal-type"
            bind:value={quickAddForm.mealType}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
      </div>
      <div class="mb-4">
        <label for="sugar-amount" class="block text-sm font-medium text-gray-700"
          >Sugar (g)</label
        >
        <input
          type="number"
          id="sugar-amount"
          bind:value={quickAddForm.sugarAmount}
          min="0"
          step="0.1"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          placeholder="Optional"
        />
      </div>
      <div class="flex justify-end">
        <button
          type="submit"
          class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Add Food
        </button>
      </div>
    </form>
    <p class="mt-4 text-center text-xs text-gray-500">
      <button
        on:click={onSearchClick}
        class="text-green-600 hover:text-green-700 hover:underline focus:outline-none"
      >
        Search our food database for more options →
      </button>
    </p>
  </div>
</div>
