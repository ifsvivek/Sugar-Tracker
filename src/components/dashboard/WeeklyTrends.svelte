<script>
  import { 
    SugarBarChart,
    CaloriesLineChart,
    NutrientDistribution,
    MonthlyTrends
  } from '$components/dashboard/charts';
  
  export let weeklyData = { 
    labels: [], 
    sugarData: [],
    calorieData: [],
    carbsData: [],
    proteinData: [],
    fatData: [],
    fiberData: [],
    mealBreakdown: [],
    monthlyTrend: {},
    dailyNutrients: []
  };
  export let foodLogs = [];
  export let totalSugar = 0;
  export let sugarGoal = 25;
  export let totalCarbs = 0;
  export let totalProtein = 0;
  export let totalFat = 0;
  export let totalFiber = 0;
  
  // Chart display state
  let activeChart = 'sugar';
  
  // Calculate average values from the actual weekly data
  $: avgSugar = weeklyData.sugarData.length > 0 
    ? Math.round(weeklyData.sugarData.reduce((sum, val) => sum + val, 0) / weeklyData.sugarData.length * 10) / 10
    : 0;
    
  // Set the active chart
  function setActiveChart(chart) {
    activeChart = chart;
  }
</script>

<div class="p-6">
  <!-- Chart Navigation Tabs -->
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-lg font-medium text-gray-900">Nutrition Analysis</h3>
    
    <div class="flex space-x-2 text-sm">
      <button 
        on:click={() => setActiveChart('sugar')}
        class={`px-3 py-1 rounded-full transition duration-200 ${activeChart === 'sugar' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        Sugar
      </button>
      <button 
        on:click={() => setActiveChart('calories')}
        class={`px-3 py-1 rounded-full transition duration-200 ${activeChart === 'calories' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        Calories
      </button>
      <button 
        on:click={() => setActiveChart('nutrients')}
        class={`px-3 py-1 rounded-full transition duration-200 ${activeChart === 'nutrients' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        Balance
      </button>
      <button 
        on:click={() => setActiveChart('trends')}
        class={`px-3 py-1 rounded-full transition duration-200 ${activeChart === 'trends' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        Trends
      </button>
    </div>
  </div>
  
  <!-- Weekly Sugar Bar Chart -->
  {#if activeChart === 'sugar'}
    <SugarBarChart 
      sugarData={weeklyData.sugarData} 
      labels={weeklyData.labels} 
      {sugarGoal} 
      mealBreakdown={weeklyData.mealBreakdown}
    />
  {/if}
  
  <!-- Calories Line Chart -->
  {#if activeChart === 'calories'}
    <CaloriesLineChart 
      calorieData={weeklyData.calorieData} 
      labels={weeklyData.labels} 
      carbsData={weeklyData.carbsData}
      proteinData={weeklyData.proteinData}
      fatData={weeklyData.fatData}
      {totalCarbs}
      {totalProtein}
      {totalFat}
    />
  {/if}
  
  <!-- Nutrients Donut/Balance Chart -->
  {#if activeChart === 'nutrients'}
    <NutrientDistribution 
      {totalCarbs}
      {totalProtein}
      {totalFat}
      {totalFiber}
      weeklyNutrients={weeklyData.dailyNutrients}
    />
  {/if}
  
  <!-- Monthly Trends Chart -->
  {#if activeChart === 'trends'}
    <MonthlyTrends
      {avgSugar}
      {totalSugar}
      {sugarGoal}
      dailyNutrients={weeklyData.dailyNutrients}
      monthlyTrend={weeklyData.monthlyTrend}
    />
  {/if}
</div>
