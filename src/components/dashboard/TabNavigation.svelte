<script>
  export let activeTab = 'today';
  export let onTabChange = () => {};
</script>

<div class="border-b border-gray-200">
  <div class="flex">
    <button
      class={`flex-1 border-b-2 px-4 py-4 text-center font-medium hover:bg-gray-50 ${activeTab === 'today' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
      on:click={() => onTabChange('today')}
    >
      Today's Summary
    </button>
    <button
      class={`flex-1 border-b-2 px-4 py-4 text-center font-medium hover:bg-gray-50 ${activeTab === 'trends' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
      on:click={() => onTabChange('trends')}
    >
      Weekly Trends
    </button>
  </div>
</div>
