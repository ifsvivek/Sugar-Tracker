<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { Navigation, Footer } from '$components';

	// Check if user is logged in from page data
	$: isLoggedIn = $page.data?.isAuthenticated ?? false;
	$: user = $page.data?.user ?? null;
	$: path = $page.url.pathname;
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
	<Navigation />

	<main class="flex-grow {isLoggedIn && path === '/' ? 'pt-0' : 'pt-0'} pb-4">
		<slot />
	</main>

	<!-- Hide footer on mobile when logged in to prevent overlap with bottom nav bar -->
	<div class={isLoggedIn ? 'hidden md:block' : ''}>
		<Footer />
	</div>
</div>
