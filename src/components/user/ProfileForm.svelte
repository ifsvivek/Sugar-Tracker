<script>
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	export let userName = '';
	export let userEmail = '';
	export let isEditMode = false;

	// Create event dispatcher
	const dispatch = createEventDispatcher();

	// Form data and state
	let formError = null;
	let formSuccess = false;

	let editFormData = {
		name: userName,
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	// Update form data when props change
	$: {
		if (!isEditMode) {
			editFormData = {
				name: userName,
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			};
			formError = null;
		}
	}

	// Track changes made to the form
	$: hasFormChanged =
		editFormData.name !== userName || editFormData.currentPassword || editFormData.newPassword;

	async function handleProfileUpdate() {
		// Validate form
		if (editFormData.newPassword !== editFormData.confirmPassword) {
			formError = 'New passwords do not match';
			return;
		}

		// Prepare data to send
		const updateData = {
			name: editFormData.name
		};

		if (editFormData.newPassword) {
			updateData.currentPassword = editFormData.currentPassword;
			updateData.newPassword = editFormData.newPassword;
		}

		try {
			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			if (!response.ok) {
				const data = await response.json();
				formError = data.error || 'Failed to update profile';
				return;
			}

			// Success
			formSuccess = true;
			formError = null;
			dispatch('success');

			// Refresh page data
			if (browser) {
				window.location.reload();
			}
		} catch (error) {
			formError = 'An unexpected error occurred';
			console.error('Error updating profile:', error);
		}
	}

	function cancelEdit() {
		editFormData = {
			name: userName,
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		};
		dispatch('cancel');
		formError = null;
	}
</script>

{#if isEditMode}
	<form on:submit|preventDefault={handleProfileUpdate} class="mt-6 space-y-6">
		<!-- Name -->
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
			<div class="mt-1">
				<input
					id="name"
					type="text"
					bind:value={editFormData.name}
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
					required
				/>
			</div>
		</div>

		<!-- Email (Read-only) -->
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700"
				>Email (Cannot be changed)</label
			>
			<div class="mt-1">
				<input
					id="email"
					type="email"
					value={userEmail}
					class="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
					readonly
				/>
			</div>
		</div>

		<!-- Password Section -->
		<div class="border-t border-gray-200 pt-4">
			<h3 class="text-base font-medium text-gray-900">Change Password</h3>
			<p class="mt-1 text-sm text-gray-500">
				Leave blank if you don't want to change your password
			</p>

			<div class="mt-4 space-y-4">
				<!-- Current Password -->
				<div>
					<label for="current-password" class="block text-sm font-medium text-gray-700">
						Current Password
					</label>
					<div class="mt-1">
						<input
							id="current-password"
							type="password"
							bind:value={editFormData.currentPassword}
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							autocomplete="current-password"
						/>
					</div>
				</div>

				<!-- New Password -->
				<div>
					<label for="new-password" class="block text-sm font-medium text-gray-700">
						New Password
					</label>
					<div class="mt-1">
						<input
							id="new-password"
							type="password"
							bind:value={editFormData.newPassword}
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							autocomplete="new-password"
						/>
					</div>
				</div>

				<!-- Confirm Password -->
				<div>
					<label for="confirm-password" class="block text-sm font-medium text-gray-700">
						Confirm Password
					</label>
					<div class="mt-1">
						<input
							id="confirm-password"
							type="password"
							bind:value={editFormData.confirmPassword}
							class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 focus:outline-none sm:text-sm"
							autocomplete="new-password"
						/>
					</div>
				</div>
			</div>
		</div>

		{#if formError}
			<div class="rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">{formError}</h3>
					</div>
				</div>
			</div>
		{/if}

		<div class="flex justify-end gap-3">
			<button
				type="button"
				class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				on:click={cancelEdit}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				disabled={!hasFormChanged}
			>
				Save Changes
			</button>
		</div>
	</form>
{:else}
	<div class="mt-6 space-y-6">
		<!-- View mode -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
			<div class="col-span-1">
				<h3 class="text-sm font-medium text-gray-500">Name</h3>
				<p class="mt-1 text-base text-gray-900">{userName}</p>
			</div>
			<div class="col-span-2">
				<h3 class="text-sm font-medium text-gray-500">Email</h3>
				<p class="mt-1 text-base text-gray-900">{userEmail}</p>
			</div>
		</div>

		<div class="flex justify-end">
			<button
				type="button"
				class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				on:click={() => dispatch('edit')}
			>
				<svg
					class="mr-1.5 -ml-0.5 h-4 w-4 text-gray-500"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
					/>
					<path
						d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
					/>
				</svg>
				Edit Profile
			</button>
		</div>
	</div>
{/if}
