<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';
  
  export let type = 'bar';
  export let data = {};
  export let options = {};
  export let width = '100%';
  export let height = '100%';
  export let updateKey = null; // This prop helps trigger updates
  
  let canvas;
  let chartInstance;
  
  function createChart() {
    if (chartInstance) {
      chartInstance.destroy();
    }
    
    if (canvas) {
      chartInstance = new Chart(canvas, {
        type,
        data,
        options
      });
    }
  }
  
  // Watch for data changes to update the chart
  $: if (chartInstance && (data || updateKey)) {
    // Update the existing chart with new data
    chartInstance.data = data;
    chartInstance.update();
  }
  
  onMount(() => {
    createChart();
  });
  
  onDestroy(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });
</script>

<canvas bind:this={canvas} style="width: {width}; height: {height};"></canvas>
