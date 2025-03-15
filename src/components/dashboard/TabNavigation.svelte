<script>
	export let activeTab = 'today';
	export let onTabChange = () => {};
</script>

<div class="sticky top-14 z-10 border-b border-gray-200 bg-white md:top-16">
	<div class="flex">
		<button
			class={`flex-1 border-b-2 px-4 py-3 text-center font-medium active:bg-gray-50 ${activeTab === 'today' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
			on:click={() => onTabChange('today')}
		>
			<div class="flex flex-col items-center justify-center md:flex-row">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mb-1 h-5 w-5 md:mr-2 md:mb-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
				<span>Today</span>
			</div>
		</button>
		<button
			class={`flex-1 border-b-2 px-4 py-3 text-center font-medium active:bg-gray-50 ${activeTab === 'trends' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
			on:click={() => onTabChange('trends')}
		>
			<div class="flex flex-col items-center justify-center md:flex-row">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mb-1 h-5 w-5 md:mr-2 md:mb-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
				<span>Trends</span>
			</div>
		</button>
	</div>
</div>
