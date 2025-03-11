<script>
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-green-800 py-8">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="md:flex md:items-center md:justify-between">
			<div class="flex justify-center md:justify-start">
				<span class="text-xl font-bold text-white">Sugar Tracker</span>
			</div>
			<div class="mt-8 md:mt-0">
				<div class="flex justify-center space-x-6 md:justify-end">
					<a href="/" class="text-green-200 hover:text-white">Home</a>
					<a href="/features" class="text-green-200 hover:text-white">Features</a>
					<a href="/about" class="text-green-200 hover:text-white">About</a>
					<a href="/contact" class="text-green-200 hover:text-white">Contact</a>
				</div>
			</div>
		</div>
		<div class="mt-8 border-t border-green-700 pt-8">
			<p class="text-center text-sm text-green-200 md:text-right">
				&copy; {currentYear} Sugar Tracker. All rights reserved.
			</p>
		</div>
	</div>
</footer>
