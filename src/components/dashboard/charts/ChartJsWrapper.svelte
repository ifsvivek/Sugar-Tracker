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
	let isError = false;
	let errorMessage = '';

	function createChart() {
		if (!canvas) return;
		
		try {
			// Clean up previous instance if it exists
			if (chartInstance) {
				chartInstance.destroy();
			}

			// Create new chart
			chartInstance = new Chart(canvas, {
				type,
				data,
				options
			});
		} catch (error) {
			console.error('Error creating chart:', error);
			isError = true;
			errorMessage = error.message || 'Failed to create chart';
		}
	}

	// Watch for data changes to update the chart
	$: if (chartInstance && (data || updateKey !== null)) {
		try {
			// Update the existing chart with new data
			chartInstance.data = data;
			// If options have changed, we need to update those too
			chartInstance.options = options;
			chartInstance.update();
		} catch (error) {
			console.error('Error updating chart:', error);
			isError = true;
			errorMessage = error.message || 'Failed to update chart';
		}
	}

	onMount(() => {
		// Small timeout to ensure the DOM is ready
		setTimeout(() => {
			createChart();
		}, 10);
	});

	onDestroy(() => {
		if (chartInstance) {
			try {
				chartInstance.destroy();
			} catch (error) {
				console.error('Error destroying chart:', error);
			}
		}
	});
</script>

{#if isError}
	<div class="flex h-full w-full flex-col items-center justify-center text-red-500">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		<p class="mt-2 text-center text-sm">Chart error: {errorMessage}</p>
	</div>
{:else}
	<canvas bind:this={canvas} style="width: {width}; height: {height};"></canvas>
{/if}
