<script>
	import { onMount } from 'svelte';
	import ChartJsWrapper from './ChartJsWrapper.svelte';

	export let totalCarbs = 0;
	export let totalProtein = 0;
	export let totalFat = 0;
	export let totalFiber = 0;
	// Real weekly nutrient data
	export let weeklyNutrients = [];

	// Create radar chart with weekly nutrient trends
	$: weeklyRadarData = {
		labels: weeklyNutrients.length > 0 
			? weeklyNutrients.map((day, i) => {
				const date = new Date(day.date);
				return date.toLocaleDateString('en-US', { weekday: 'short' });
			})
			: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Carbs (g)',
				data: weeklyNutrients.map(day => day.carbs),
				backgroundColor: 'rgba(59, 130, 246, 0.2)',
				borderColor: 'rgb(37, 99, 235)',
				pointBackgroundColor: 'rgb(37, 99, 235)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(37, 99, 235)'
			},
			{
				label: 'Protein (g)',
				data: weeklyNutrients.map(day => day.protein),
				backgroundColor: 'rgba(16, 185, 129, 0.2)',
				borderColor: 'rgb(5, 150, 105)',
				pointBackgroundColor: 'rgb(5, 150, 105)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(5, 150, 105)'
			},
			{
				label: 'Fat (g)',
				data: weeklyNutrients.map(day => day.fat),
				backgroundColor: 'rgba(139, 92, 246, 0.2)',
				borderColor: 'rgb(109, 40, 217)',
				pointBackgroundColor: 'rgb(109, 40, 217)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(109, 40, 217)'
			}
		]
	};
	
	$: weeklyRadarOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			r: {
				angleLines: {
					display: true
				},
				suggestedMin: 0
			}
		},
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					boxWidth: 12,
					font: {
						size: 10
					}
				}
			}
		}
	};

	// Calculate percentage for donut chart segments
	$: totalNutrients = totalCarbs + totalProtein + totalFat + totalFiber;
	$: carbsPercent = totalNutrients ? Math.round((totalCarbs / totalNutrients) * 100) : 0;
	$: proteinPercent = totalNutrients ? Math.round((totalProtein / totalNutrients) * 100) : 0;
	$: fatPercent = totalNutrients ? Math.round((totalFat / totalNutrients) * 100) : 0;
	$: fiberPercent = totalNutrients ? Math.round((totalFiber / totalNutrients) * 100) : 0;

	// Create donut chart data
	$: nutrientChartData = {
		labels: ['Carbs', 'Protein', 'Fat', 'Fiber'],
		datasets: [
			{
				label: 'Grams',
				data: [totalCarbs, totalProtein, totalFat, totalFiber],
				backgroundColor: [
					'rgba(59, 130, 246, 0.7)', // blue for carbs
					'rgba(16, 185, 129, 0.7)', // green for protein
					'rgba(139, 92, 246, 0.7)', // purple for fat
					'rgba(245, 158, 11, 0.7)' // amber for fiber
				],
				borderColor: [
					'rgb(37, 99, 235)',
					'rgb(5, 150, 105)',
					'rgb(109, 40, 217)',
					'rgb(217, 119, 6)'
				],
				borderWidth: 1,
				hoverOffset: 20
			}
		]
	};

	// Donut chart options
	$: nutrientChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: '65%',
		plugins: {
			legend: {
				position: 'right',
				labels: {
					generateLabels: (chart) => {
						const datasets = chart.data.datasets;
						return chart.data.labels.map((label, i) => {
							const meta = chart.getDatasetMeta(0);
							const style = meta.controller.getStyle(i);
							const value = datasets[0].data[i];
							const percent = totalNutrients ? Math.round((value / totalNutrients) * 100) : 0;

							return {
								text: `${label}: ${value}g (${percent}%)`,
								fillStyle: style.backgroundColor,
								strokeStyle: style.borderColor,
								lineWidth: style.borderWidth,
								hidden: isNaN(value) || meta.data[i].hidden,
								index: i
							};
						});
					},
					boxWidth: 12,
					font: {
						size: 10
					}
				}
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						const value = context.raw;
						const percent = totalNutrients ? Math.round((value / totalNutrients) * 100) : 0;
						return `${context.label}: ${value}g (${percent}%)`;
					}
				}
			}
		}
	};

	// Balance chart data
	$: balanceData = {
		labels: ['Carbs (45-65%)', 'Protein (10-35%)', 'Fat (20-35%)'],
		datasets: [
			{
				label: 'Your %',
				data: [carbsPercent, proteinPercent, fatPercent],
				backgroundColor: [
					carbsPercent >= 45 && carbsPercent <= 65
						? 'rgba(16, 185, 129, 0.7)'
						: 'rgba(239, 68, 68, 0.7)',
					proteinPercent >= 10 && proteinPercent <= 35
						? 'rgba(16, 185, 129, 0.7)'
						: 'rgba(239, 68, 68, 0.7)',
					fatPercent >= 20 && fatPercent <= 35
						? 'rgba(16, 185, 129, 0.7)'
						: 'rgba(239, 68, 68, 0.7)'
				]
			}
		]
	};

	// Balance chart options
	$: balanceOptions = {
		indexAxis: 'y',
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				min: 0,
				max: 100,
				grid: {
					color: (context) => {
						if (context.tick.value === 0) return 'rgba(0, 0, 0, 0.1)';
						if (context.tick.value === 45 || context.tick.value === 65)
							return 'rgba(16, 185, 129, 0.3)';
						if (context.tick.value === 10 || context.tick.value === 35)
							return 'rgba(16, 185, 129, 0.3)';
						if (context.tick.value === 20 || context.tick.value === 35)
							return 'rgba(16, 185, 129, 0.3)';
						return 'rgba(0, 0, 0, 0.05)';
					}
				},
				title: {
					display: true,
					text: 'Percentage of total macronutrients'
				}
			},
			y: {
				grid: {
					display: false
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
						const index = items[0].dataIndex;
						if (index === 0) return 'Carbs (45-65%)';
						if (index === 1) return 'Protein (10-35%)';
						if (index === 2) return 'Fat (20-35%)';
					},
					label: (item) => {
						const value = item.raw;
						const index = item.dataIndex;
						let status = '';
						if (index === 0) {
							status =
								value >= 45 && value <= 65
									? '✓ Within recommended range'
									: '✗ Outside recommended range';
						} else if (index === 1) {
							status =
								value >= 10 && value <= 35
									? '✓ Within recommended range'
									: '✗ Outside recommended range';
						} else if (index === 2) {
							status =
								value >= 20 && value <= 35
									? '✓ Within recommended range'
									: '✗ Outside recommended range';
						}
						return [`Current: ${value}%`, status];
					}
				}
			},
			annotation: {
				annotations: {
					carbs1: {
						type: 'box',
						xMin: 45,
						xMax: 65,
						yMin: -0.5,
						yMax: 0.5,
						backgroundColor: 'rgba(16, 185, 129, 0.1)',
						borderColor: 'rgba(16, 185, 129, 0.2)'
					},
					protein1: {
						type: 'box',
						xMin: 10,
						xMax: 35,
						yMin: 0.5,
						yMax: 1.5,
						backgroundColor: 'rgba(16, 185, 129, 0.1)',
						borderColor: 'rgba(16, 185, 129, 0.2)'
					},
					fat1: {
						type: 'box',
						xMin: 20,
						xMax: 35,
						yMin: 1.5,
						yMax: 2.5,
						backgroundColor: 'rgba(16, 185, 129, 0.1)',
						borderColor: 'rgba(16, 185, 129, 0.2)'
					}
				}
			}
		}
	};
</script>

<div class="mb-6 space-y-6">
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<h4 class="mb-6 text-center text-gray-700">Macronutrient Distribution</h4>

		<div class="h-60">
			<ChartJsWrapper
				type="doughnut"
				data={nutrientChartData}
				options={nutrientChartOptions}
				height="100%"
				updateKey={totalNutrients}
			/>
		</div>

		<div class="mt-4 text-center text-sm">
			<span class="font-medium">Total:</span>
			{totalNutrients}g
		</div>
	</div>

	<!-- Weekly Nutrient Radar Chart -->
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<h4 class="mb-4 text-sm font-medium text-gray-700">Weekly Nutrient Pattern</h4>
		<div class="h-72">
			{#if weeklyNutrients && weeklyNutrients.length > 1}
				<ChartJsWrapper
					type="radar"
					data={weeklyRadarData}
					options={weeklyRadarOptions}
					height="100%"
					updateKey={weeklyNutrients.length}
				/>
			{:else}
				<div class="flex h-full w-full items-center justify-center">
					<p class="text-gray-400">Not enough data to display weekly nutrient patterns</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Macronutrient balance -->
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<h4 class="mb-4 text-sm font-medium text-gray-700">Recommended Balance</h4>
		<div class="h-44">
			<ChartJsWrapper
				type="bar"
				data={balanceData}
				options={balanceOptions}
				height="100%"
				updateKey={carbsPercent + proteinPercent + fatPercent}
			/>
		</div>
	</div>
</div>
