<script>
	// Props for the component
	export let isOpen = false;
	export let item = null;
	export let isDeleting = false;
	export let title = 'Delete Confirmation';

	// Events that component will dispatch
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// Handler functions
	function handleCancel() {
		dispatch('cancel');
	}

	function handleConfirm() {
		dispatch('confirm');
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-screen items-center justify-center px-4 text-center">
			<!-- Backdrop overlay -->
			<div
				class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
				on:click={handleCancel}
				on:keydown={(e) => e.key === 'Escape' && handleCancel()}
				role="button"
				tabindex="0"
				aria-label="Close modal"
			></div>

			<!-- Modal content -->
			<div
				class="inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
			>
				<div class="mb-4">
					<h3 class="text-lg font-medium text-gray-900">{title}</h3>
					<p class="mt-2 text-sm text-gray-500">
						Are you sure you want to delete this food log? This action cannot be undone.
					</p>
					{#if item}
						<div class="mt-3 rounded-md bg-gray-50 p-3">
							<p class="font-medium">{item.food}</p>
							<p class="text-sm text-gray-500">
								{item.name} at {item.time} - {item.servingSize} serving(s)
							</p>
						</div>
					{/if}
				</div>

				<div class="mt-5 flex justify-end space-x-3">
					<button
						type="button"
						class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
						on:click={handleCancel}
						disabled={isDeleting}
					>
						Cancel
					</button>
					<button
						type="button"
						class="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
						on:click={handleConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
