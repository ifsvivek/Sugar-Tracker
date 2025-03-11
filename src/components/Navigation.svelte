<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Combined check for authentication
	$: isLoggedIn = !!$page.data.isAuthenticated;
	// Get user data from page data
	$: userData = $page.data.user || {};

	async function handleLogout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		window.location.href = '/';
	}

	// Mobile menu state
	let mobileMenuOpen = false;
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<nav class="bg-white shadow-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex items-center">
				<div class="flex flex-shrink-0 items-center">
					<a href="/" class="text-xl font-bold text-green-600">Sugar Tracker</a>
				</div>
				<!-- Desktop navigation -->
				<div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
					<a href="/" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
						>Home</a
					>
					<a
						href="/features"
						class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600">Features</a
					>
					<a href="/about" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
						>About</a
					>
				</div>
			</div>
			<div class="hidden md:flex md:items-center md:space-x-4">
				{#if isLoggedIn}
					{#if userData.name}
						<span class="text-sm font-medium text-gray-700">Hi, {userData.name}</span>
					{/if}
					<a
						href="/dashboard"
						class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600">Dashboard</a
					>
					<button
						on:click={handleLogout}
						class="focus:ring-opacity-50 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
					>
						Logout
					</button>
				{:else}
					<a href="/login" class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600"
						>Login</a
					>
					<a
						href="/register"
						class="focus:ring-opacity-50 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
					>
						Sign Up
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="flex items-center md:hidden">
				<button
					on:click={toggleMobileMenu}
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-green-600 focus:ring-2 focus:ring-green-500 focus:outline-none focus:ring-inset"
				>
					<span class="sr-only">Open main menu</span>
					<!-- Icon when menu is closed -->
					<svg
						class="{!mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
					<!-- Icon when menu is open -->
					<svg
						class="{mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state -->
	{#if mobileMenuOpen}
		<div class="md:hidden">
			<div class="space-y-1 px-2 pt-2 pb-3">
				<a
					href="/"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-green-600"
					>Home</a
				>
				<a
					href="/features"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-green-600"
					>Features</a
				>
				<a
					href="/about"
					class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-green-600"
					>About</a
				>

				{#if isLoggedIn}
					{#if userData.name}
						<div class="block px-3 py-2 font-medium text-gray-700">Hi, {userData.name}</div>
					{/if}
					<a
						href="/dashboard"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-green-600"
						>Dashboard</a
					>
					<button
						on:click={handleLogout}
						class="mt-1 block w-full rounded-md bg-green-600 px-3 py-2 text-base font-medium text-white hover:bg-green-700"
					>
						Logout
					</button>
				{:else}
					<a
						href="/login"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-green-600"
						>Login</a
					>
					<a
						href="/register"
						class="mt-1 block w-full rounded-md bg-green-600 px-3 py-2 text-base font-medium text-white hover:bg-green-700"
					>
						Sign Up
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
