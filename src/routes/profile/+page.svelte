<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { GoalSettingsModal } from '$components';
	import { DeleteAccountModal, ProfileForm, NutritionGoalsCard } from '$components/user';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// User data - get from data first (server-side), fallback to page store
	$: user = data.user || $page.data.user || {};
	$: userName = user.name || 'User';
	$: userEmail = user.email || '';
	$: goals = data.goals || [];
	$: isAuthenticated = !!user.id;

	// Check authentication and redirect if needed
	$: {
		if (!isAuthenticated) {
			window.location.href = '/login?redirectTo=/profile';
		}
	}

	// State management
	let isLoading = true;
	let isGoalModalOpen = false;
	let isEditMode = false;
	let isDeleteModalOpen = false;

	// Handle successful goal update
	function handleGoalSuccess() {
		// Refresh data
		if (browser) {
			window.location.reload();
		}
	}

	// Add logout function
	async function handleLogout() {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST'
			});
			if (response.ok) {
				window.location.href = '/';
			}
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	onMount(() => {
		// Simulate loading
		setTimeout(() => {
			isLoading = false;
		}, 500);
	});
</script>

<svelte:head>
	<title>Profile | Sugar Tracker</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 pb-12">
	<div class="bg-gradient-to-r from-green-600 to-teal-500 pb-16 shadow-md md:pb-24">
		<div class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="text-2xl font-bold text-white sm:text-3xl md:text-4xl">My Profile</h1>
				<p class="mt-2 text-white opacity-90">Manage your account and preferences</p>
			</div>
			<!-- Add navigation links -->
			<div class="mt-6 flex justify-center space-x-4">
				<a 
					href="/features" 
					class="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
				>
					View Features
				</a>
				<a 
					href="/about" 
					class="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
				>
					About Us
				</a>
			</div>
		</div>
	</div>

	<!-- Profile Content -->
	<div class="mx-auto -mt-12 max-w-3xl px-4 sm:px-6 lg:px-8">
		<div class="space-y-6">
			<!-- User Profile Card -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				{#if isLoading}
					<div class="flex h-40 items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"
						></div>
					</div>
				{:else}
					<div class="border-b border-gray-200 pb-4">
						<h2 class="text-lg leading-6 font-medium text-gray-900">Account Information</h2>
						<p class="mt-1 text-sm text-gray-500">Manage your personal information and password</p>
					</div>

					<ProfileForm
						{userName}
						{userEmail}
						{isEditMode}
						on:edit={() => (isEditMode = true)}
						on:cancel={() => (isEditMode = false)}
						on:success={() => (isEditMode = false)}
					/>
				{/if}
			</div>

			<!-- Nutrition Goals Card -->
			<NutritionGoalsCard {isLoading} {goals} on:openGoalsModal={() => (isGoalModalOpen = true)} />

			<!-- Logout Section -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-lg leading-6 font-medium text-gray-900">Logout</h2>
						<p class="mt-1 text-sm text-gray-500">Sign out from your account</p>
					</div>
					<button
						on:click={handleLogout}
						class="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
					>
						Logout
					</button>
				</div>
			</div>

			<!-- Delete Account Section -->
			<div class="rounded-lg bg-white p-6 shadow-md">
				<div class="border-b border-gray-200 pb-4">
					<h2 class="text-lg leading-6 font-medium text-gray-900">Delete Account</h2>
					<p class="mt-1 text-sm text-gray-500">Permanently remove your account and all data</p>
				</div>

				<div class="mt-6 flex items-center justify-between">
					<p class="text-sm text-gray-500">
						This action cannot be undone. All your data will be permanently deleted.
					</p>
					<button
						type="button"
						on:click={() => (isDeleteModalOpen = true)}
						class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
					>
						Delete Account
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Goal Settings Modal -->
<GoalSettingsModal
	isOpen={isGoalModalOpen}
	currentGoals={goals}
	on:close={() => (isGoalModalOpen = false)}
	on:success={handleGoalSuccess}
/>

<!-- Delete Account Modal -->
<DeleteAccountModal
	isOpen={isDeleteModalOpen}
	on:close={() => (isDeleteModalOpen = false)}
	on:success={() => {
		// Handle successful account deletion
		if (browser) {
			window.location.href = '/';
		}
	}}
/>
