<script>
  import ChartJsWrapper from './ChartJsWrapper.svelte';
  
  export let calorieData = [];
  export let labels = [];
  export let totalCarbs = 0;
  export let totalProtein = 0;
  export let totalFat = 0;
  // New props for daily breakdown
  export let carbsData = [];
  export let proteinData = [];
  export let fatData = [];
  
  // Calculate average values
  $: avgCalories = calorieData?.length > 0 
    ? Math.round(calorieData.reduce((sum, val) => sum + val, 0) / calorieData.length)
    : 0;
  
  // Calculate macronutrient calories
  $: carbsCalories = Math.round(totalCarbs * 4);
  $: proteinCalories = Math.round(totalProtein * 4); 
  $: fatCalories = Math.round(totalFat * 9);
  $: totalCalories = carbsCalories + proteinCalories + fatCalories;
  
  // Weekly calorie chart data
  $: calorieChartData = {
    labels,
    datasets: [
      {
        label: 'Calories',
        data: calorieData,
        fill: {
          target: 'origin',
          above: 'rgba(16, 185, 129, 0.1)'
        },
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgb(16, 185, 129)',
        tension: 0.3,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(16, 185, 129)',
        pointRadius: 5,
        pointHoverRadius: 8
      }
    ]
  };
  
  // Add stacked bar chart for daily macronutrient breakdown
  $: macroBreakdownData = {
    labels,
    datasets: [
      {
        label: 'Carbs',
        data: carbsData.map(c => c * 4), // Convert to calories
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 1,
      },
      {
        label: 'Protein',
        data: proteinData.map(p => p * 4), // Convert to calories
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(5, 150, 105)',
        borderWidth: 1,
      },
      {
        label: 'Fat',
        data: fatData.map(f => f * 9), // Convert to calories
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgb(109, 40, 217)',
        borderWidth: 1,
      }
    ]
  };
  
  $: macroBreakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calories'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          footer: (tooltipItems) => {
            let total = 0;
            tooltipItems.forEach(item => {
              total += item.parsed.y;
            });
            return `Total: ${Math.round(total)} calories`;
          }
        }
      }
    }
  };
  
  // Calorie chart options
  $: calorieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calories'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  
  // Macronutrient distribution chart
  $: macroChartData = {
    labels: ['Carbs', 'Protein', 'Fat'],
    datasets: [
      {
        label: 'Calories',
        data: [carbsCalories, proteinCalories, fatCalories],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',  // blue for carbs
          'rgba(16, 185, 129, 0.7)',  // green for protein
          'rgba(139, 92, 246, 0.7)',  // purple for fat
        ],
        borderColor: [
          'rgb(37, 99, 235)',
          'rgb(5, 150, 105)',
          'rgb(109, 40, 217)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Doughnut chart options
  $: macroChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} cal (${percentage}%)`;
          }
        }
      }
    }
  };
</script>

<div class="mb-6 space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="font-medium text-gray-900">Weekly Calorie Intake</h4>
    <div class="text-sm font-medium text-gray-700">
      Avg: {avgCalories} calories/day
    </div>
  </div>
  
  <div class="h-64 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    {#if calorieData && calorieData.length > 1}
      <ChartJsWrapper type="line" data={calorieChartData} options={calorieChartOptions} height="100%" />
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <p class="text-gray-400">No calorie data available</p>
      </div>
    {/if}
  </div>
  
  <!-- Daily Macronutrient Breakdown -->
  <div class="h-64 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h4 class="mb-3 text-sm font-medium text-gray-700">Daily Macronutrient Calories</h4>
    {#if carbsData.length > 0 && proteinData.length > 0 && fatData.length > 0}
      <ChartJsWrapper type="bar" data={macroBreakdownData} options={macroBreakdownOptions} height="100%" />
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <p class="text-gray-400">No macronutrient data available</p>
      </div>
    {/if}
  </div>
  
  <!-- Calorie sources -->
  <div class="mt-4 grid grid-cols-4 gap-4">
    <div class="rounded-lg bg-blue-50 p-3 text-center transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-md">
      <p class="text-xs text-gray-500">From Carbs</p>
      <p class="mt-1 font-medium text-blue-700">{carbsCalories} cal</p>
    </div>
    <div class="rounded-lg bg-green-50 p-3 text-center transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-md">
      <p class="text-xs text-gray-500">From Protein</p>
      <p class="mt-1 font-medium text-green-700">{proteinCalories} cal</p>
    </div>
    <div class="rounded-lg bg-purple-50 p-3 text-center transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-md">
      <p class="text-xs text-gray-500">From Fat</p>
      <p class="mt-1 font-medium text-purple-700">{fatCalories} cal</p>
    </div>
    <div class="rounded-lg bg-gray-50 p-3 text-center transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-md">
      <p class="text-xs text-gray-500">Total Today</p>
      <p class="mt-1 font-medium text-gray-700">{totalCalories} cal</p>
    </div>
  </div>
  
  <!-- Macronutrient Distribution Doughnut Chart -->
  <div class="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h4 class="mb-4 text-sm font-medium text-center text-gray-700">Today's Calorie Sources</h4>
    <div class="h-60">
      <ChartJsWrapper type="doughnut" data={macroChartData} options={macroChartOptions} height="100%" />
    </div>
  </div>
</div>
