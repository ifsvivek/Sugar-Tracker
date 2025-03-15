<script>
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	export let isOpen = false;

	// Create event dispatcher
	const dispatch = createEventDispatcher();

	let deleteConfirmText = '';
	let deleteError = null;

	// Reset form when modal is opened
	$: if (isOpen) {
		deleteConfirmText = '';
		deleteError = null;
	}

	async function handleDeleteAccount() {
		if (deleteConfirmText !== 'DELETE') {
			deleteError = 'Please type DELETE to confirm';
			return;
		}

		try {
			const response = await fetch('/api/user/account', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const data = await response.json();
				deleteError = data.error || 'Failed to delete account';
				return;
			}

			dispatch('success');

			// Redirect to home page after successful deletion
			if (browser) {
				window.location.href = '/';
			}
		} catch (error) {
			deleteError = 'An unexpected error occurred';
			console.error('Error deleting account:', error);
		}
	}

	function closeModal() {
		deleteConfirmText = '';
		deleteError = null;
		dispatch('close');
	}
</script>

{#if isOpen}
	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div
			class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
		>
			<!-- Background overlay -->
			<div
				class="bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity"
				on:click={closeModal}
			></div>

			<!-- Modal panel -->
			<div
				class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
			>
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div
							class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
						>
							<!-- Warning icon -->
							<svg
								class="h-6 w-6 text-red-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
							<div class="mt-2">
								<p class="text-sm text-gray-500">
									Are you sure you want to delete your account? This action cannot be undone and
									will permanently delete all your data.
								</p>
								<div class="mt-4">
									<label for="confirm-delete" class="block text-sm font-medium text-gray-700">
										Type DELETE to confirm
									</label>
									<div class="mt-1">
										<input
											type="text"
											id="confirm-delete"
											bind:value={deleteConfirmText}
											class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 focus:outline-none sm:text-sm"
										/>
									</div>
									{#if deleteError}
										<p class="mt-2 text-sm text-red-600">{deleteError}</p>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						type="button"
						on:click={handleDeleteAccount}
						class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
					>
						Delete Account
					</button>
					<button
						type="button"
						on:click={closeModal}
						class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
