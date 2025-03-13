<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { Navigation, Footer } from '$components';

	// Check if user is logged in from page data
	$: isLoggedIn = $page.data?.isAuthenticated ?? false;
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
	<Navigation />

	<main class="flex-grow">
		<slot />
	</main>

	<Footer />
</div>
