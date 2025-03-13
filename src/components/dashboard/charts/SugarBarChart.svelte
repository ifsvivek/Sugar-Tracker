<script>
  import { onMount } from 'svelte';
  import ChartJsWrapper from './ChartJsWrapper.svelte';
  
  export let sugarData = [];
  export let labels = [];
  export let sugarGoal = 25;
  export let mealBreakdown = [];
  
  // Calculate average values
  $: avgSugar = sugarData.length > 0 
    ? Math.round(sugarData.reduce((sum, val) => sum + val, 0) / sugarData.length * 10) / 10
    : 0;
    
  // Calculate color for trend indicators
  function getTrendColor(current, target) {
    return current <= target ? 'text-green-500' : 'text-red-500';
  }
  
  // Get max value for better chart scaling
  $: maxSugar = Math.max(...sugarData, sugarGoal, 1) * 1.2;
  
  // Prepare Chart.js data
  $: weeklyChartData = {
    labels,
    datasets: [
      {
        label: 'Sugar (g)',
        data: sugarData,
        backgroundColor: sugarData.map(value => value > sugarGoal ? 'rgba(239, 68, 68, 0.7)' : 'rgba(16, 185, 129, 0.7)'),
        borderColor: sugarData.map(value => value > sugarGoal ? 'rgb(220, 38, 38)' : 'rgb(4, 120, 87)'),
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };
  
  // Chart.js options
  $: weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sugar (g)'
        },
        grid: {
          display: true
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            if (!items.length) return '';
            return `${items[0].label}`;
          },
          label: (item) => {
            return `Sugar: ${item.raw}g`;
          },
          afterLabel: (item) => {
            const val = item.raw;
            if (val > sugarGoal) {
              return `Goal: ${sugarGoal}g (Exceeded by ${Math.round((val - sugarGoal) * 10) / 10}g)`;
            } else {
              return `Goal: ${sugarGoal}g`;
            }
          }
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: sugarGoal,
            yMax: sugarGoal,
            borderColor: 'rgba(75, 192, 192, 0.8)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              enabled: true,
              content: `Goal: ${sugarGoal}g`,
              position: 'end',
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
            }
          }
        }
      }
    }
  };
  
  // Meal breakdown chart data
  $: mealChartData = {
    labels: mealBreakdown.map(meal => meal.name),
    datasets: [{
      label: 'Sugar (g)',
      data: mealBreakdown.map(meal => meal.sugar),
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',  // blue
        'rgba(16, 185, 129, 0.7)',  // green
        'rgba(99, 102, 241, 0.7)',  // indigo
        'rgba(245, 158, 11, 0.7)'   // amber
      ],
      borderColor: [
        'rgb(37, 99, 235)',
        'rgb(5, 150, 105)',
        'rgb(79, 70, 229)',
        'rgb(217, 119, 6)'
      ],
      borderWidth: 1,
      borderRadius: 4
    }]
  };
  
  // Meal chart options
  $: mealChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sugar (g)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.raw}g (${mealBreakdown[item.dataIndex].percentage}%)`
        }
      }
    }
  };
</script>

<div class="mb-6 space-y-4">
  <div class="flex items-center justify-between">
    <h4 class="font-medium text-gray-900">Weekly Sugar Intake</h4>
    <div class="flex items-center space-x-1 text-sm font-medium">
      <span class={getTrendColor(avgSugar, sugarGoal)}>
        Avg: {avgSugar}g
      </span>
      <span class="text-gray-500">/</span>
      <span class="text-gray-800">Goal: {sugarGoal}g</span>
    </div>
  </div>
  
  <div class="h-64 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    {#if sugarData && sugarData.length}
      <ChartJsWrapper type="bar" data={weeklyChartData} options={weeklyChartOptions} height="100%" updateKey={sugarGoal} />
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <p class="text-gray-400">Not enough data to display weekly trends</p>
      </div>
    {/if}
  </div>
  
  <!-- Meal breakdown chart -->
  <div class="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <h4 class="mb-3 text-sm font-medium text-gray-700">Sugar by Meal Type</h4>
    <div class="h-80">
      {#if mealBreakdown && mealBreakdown.length && mealBreakdown.some(meal => meal.sugar > 0)}
        <ChartJsWrapper type="bar" data={mealChartData} options={mealChartOptions} height="100%" />
      {:else}
        <div class="flex h-full w-full items-center justify-center">
          <p class="text-gray-400">No meal breakdown data available</p>
        </div>
      {/if}
    </div>
  </div>
</div>
