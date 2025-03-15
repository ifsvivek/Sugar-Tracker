<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Combined check for authentication
	$: isLoggedIn = !!$page.data.isAuthenticated;
	// Get user data from page data
	$: userData = $page.data.user || {};

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			// Use reload instead of a simple redirect to clear state
			if (browser) {
				window.location.href = '/';
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	// Mobile menu state
	let mobileMenuOpen = false;
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Active page tracking for highlighting
	$: path = $page.url.pathname;
</script>

<!-- Desktop Navigation only - hidden on mobile when user is logged in -->
<nav
	class="fixed top-0 z-40 w-full bg-white shadow-sm md:shadow-md {isLoggedIn
		? 'hidden md:block'
		: ''}"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-14 justify-between md:h-16">
			<div class="flex items-center">
				<div class="flex flex-shrink-0 items-center">
					<a href="/" class="text-xl font-bold text-green-600">Sugar Tracker</a>
				</div>
				<!-- Desktop navigation -->
				<div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
					<a
						href="/"
						class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 {path === '/'
							? 'text-green-600'
							: ''}"
					>
						Home
					</a>
					<a
						href="/features"
						class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 {path ===
						'/features'
							? 'text-green-600'
							: ''}"
					>
						Features
					</a>
					<a
						href="/about"
						class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 {path ===
						'/about'
							? 'text-green-600'
							: ''}"
					>
						About
					</a>
				</div>
			</div>
			<div class="hidden md:flex md:items-center md:space-x-4">
				{#if isLoggedIn}
					{#if userData.name}
						<span class="text-sm font-medium text-gray-700">Hi, {userData.name}</span>
					{/if}
					<a
						href="/"
						class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 {path === '/'
							? 'text-green-600'
							: ''}"
					>
						Dashboard
					</a>
					<button
						on:click={handleLogout}
						class="focus:ring-opacity-50 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
					>
						Logout
					</button>
				{:else}
					<a
						href="/login"
						class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 {path ===
						'/login'
							? 'text-green-600'
							: ''}"
					>
						Login
					</a>
					<a
						href="/register"
						class="focus:ring-opacity-50 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
					>
						Sign Up
					</a>
				{/if}
			</div>

			<!-- Mobile menu button - only show when not logged in -->
			<div class="flex items-center {isLoggedIn ? 'hidden' : 'md:hidden'}">
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

	<!-- Mobile menu, show/hide based on menu state (only for non-logged in users) -->
	{#if mobileMenuOpen && !isLoggedIn}
		<div class="fixed inset-x-0 top-14 z-50 bg-white shadow-lg md:hidden">
			<div class="space-y-1 px-2 pt-2 pb-3">
				<a
					href="/"
					class="block rounded-md px-3 py-2.5 text-base font-medium {path === '/'
						? 'bg-green-50 text-green-600'
						: 'text-gray-700'} hover:bg-gray-100 hover:text-green-600"
				>
					Home
				</a>
				<a
					href="/features"
					class="block rounded-md px-3 py-2.5 text-base font-medium {path === '/features'
						? 'bg-green-50 text-green-600'
						: 'text-gray-700'} hover:bg-gray-100 hover:text-green-600"
				>
					Features
				</a>
				<a
					href="/about"
					class="block rounded-md px-3 py-2.5 text-base font-medium {path === '/about'
						? 'bg-green-50 text-green-600'
						: 'text-gray-700'} hover:bg-gray-100 hover:text-green-600"
				>
					About
				</a>

				<a
					href="/login"
					class="block rounded-md px-3 py-2.5 text-base font-medium {path === '/login'
						? 'bg-green-50 text-green-600'
						: 'text-gray-700'} hover:bg-gray-100 hover:text-green-600"
				>
					Login
				</a>
				<a
					href="/register"
					class="mt-1 block w-full rounded-md bg-green-600 px-3 py-2.5 text-base font-medium text-white hover:bg-green-700"
				>
					Sign Up
				</a>
			</div>
		</div>
	{/if}
</nav>

<!-- Bottom navigation bar for mobile-app feel (only shows when logged in) -->
{#if isLoggedIn}
	<div class="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-200 bg-white md:hidden">
		<a
			href="/"
			class="flex flex-1 flex-col items-center justify-center py-3 {path === '/'
				? 'text-green-600'
				: 'text-gray-600'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
				/>
			</svg>
			<span class="mt-1 text-xs">Dashboard</span>
		</a>

		<!-- Log Food Link -->
		<a
			href="/log"
			class="flex flex-1 flex-col items-center justify-center py-3 {path === '/log'
				? 'text-green-600'
				: 'text-gray-600'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			<span class="mt-1 text-xs">Log Food</span>
		</a>

		<!-- Trends Link -->
		<a
			href="/trends"
			class="flex flex-1 flex-col items-center justify-center py-3 {path === '/trends'
				? 'text-green-600'
				: 'text-gray-600'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
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
			<span class="mt-1 text-xs">Trends</span>
		</a>

		<!-- Profile Link -->
		<a
			href="/profile"
			class="flex flex-1 flex-col items-center justify-center py-3 {path === '/profile'
				? 'text-green-600'
				: 'text-gray-600'}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
				/>
			</svg>
			<span class="mt-1 text-xs">Profile</span>
		</a>
	</div>
{/if}



<!-- Only add top nav spacing when needed -->
{#if !isLoggedIn}
  <div class="h-14 md:h-16"></div>
{:else}
  <!-- Remove this spacing for mobile when logged in -->
  <div class="hidden md:block md:h-16"></div>
{/if}
