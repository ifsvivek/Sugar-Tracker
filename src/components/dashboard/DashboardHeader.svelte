<script>
  export let userName = 'User';
  export let isLoading = false;
  
  // Props for action button
  export let onActionClick = () => {};
  export let actionText = 'Set Nutrition Goals';
</script>

<div class="bg-gradient-to-r from-green-600 to-teal-500 pb-32 shadow-md">
  <div class="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-3xl font-bold text-white sm:text-4xl">
          {#if isLoading}
            <div class="h-10 w-48 animate-pulse rounded bg-white/20"></div>
          {:else}
            Welcome back, {userName}
          {/if}
        </h1>
        <p class="mt-2 text-lg text-white opacity-90">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
      <div class="mt-4 flex md:mt-0">
        <button
          on:click={onActionClick}
          class="inline-flex items-center rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-green-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
            />
          </svg>
          {actionText}
        </button>
      </div>
    </div>
  </div>
</div>
