<script>
    import { onMount } from 'svelte';

    let pageLoaded = false;
    onMount(() => {
        setTimeout(() => {
            pageLoaded = true;
        }, 100);
    });

    const features = [
        {
            id: 1,
            title: 'Smart Sugar Tracking',
            description: 'Advanced tracking with AI-powered insights to help you understand and manage your daily sugar intake. Get personalized recommendations based on your consumption patterns.',
            icon: 'chart-bar',
            image: 'https://images.unsplash.com/photo-1618899731801-13c7bcd4c4f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
        },
        {
            id: 2,
            title: 'Comprehensive Analytics',
            description: 'Detailed nutritional breakdowns with interactive charts and visualizations. Track macros, vitamins, minerals and get weekly/monthly progress reports.',
            icon: 'chart-pie',
            image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
        },
        {
            id: 3,
            title: 'Custom Goal Setting',
            description: 'Set personalized goals with our smart recommendation engine. Get adaptive targets based on your progress and lifestyle changes.',
            icon: 'flag',
            image: 'https://images.unsplash.com/photo-1522844990619-4951c40f7eda?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
        },
        {
            id: 4,
            title: 'USDA Food Database',
            description: 'Access over 500,000 food items with verified nutritional data. Quickly search and log meals with our intuitive interface.',
            icon: 'database',
            image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
        }
    ];

    // Function to get SVG icon based on name
    function getIcon(name) {
        switch (name) {
            case 'chart-bar':
                return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>`;
            case 'chart-pie':
                return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>`;
            case 'flag':
                return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>`;
            case 'database':
                return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>`;
            case 'document-report':
                return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>`;
            case 'light-bulb':
                return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>`;
            default:
                return '';
        }
    }
</script>

<svelte:head>
    <title>Features | Sugar Tracker</title>
    <meta
        name="description"
        content="Explore the powerful features of Sugar Tracker - Smart sugar monitoring, comprehensive analytics, and personalized insights for better health."
    />
</svelte:head>

<div class="bg-white">
    <!-- Hero section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-teal-400">
        <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div class="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Powerful Features for
                    <span class="block text-teal-200">Better Health Tracking</span>
                </h1>
                <p class="mx-auto mt-6 max-w-2xl text-xl text-green-50">
                    Advanced tools and insights to help you maintain a balanced and healthy lifestyle.
                </p>
            </div>
        </div>
    </div>

    <!-- Features grid -->
    <div class="py-16 sm:py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid gap-12 lg:grid-cols-2">
                {#each features as feature}
                    <div class="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div class="aspect-w-16 aspect-h-9">
                            <!-- <img src={feature.image} alt={feature.title} class="h-full w-full object-cover" /> -->
                        </div>
                        <div class="flex flex-1 flex-col p-6">
                            <div class="mb-4 flex items-center">
                                <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    {@html getIcon(feature.icon)}
                                </div>
                                <h3 class="text-xl font-bold text-gray-900">{feature.title}</h3>
                            </div>
                            <p class="mb-8 flex-1 text-gray-600">{feature.description}</p>
                            <a
                                href="/register"
                                class="inline-flex items-center text-green-600 hover:text-green-700"
                            >
                                Learn more
                                <svg class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-green-50 py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
                class="rounded-2xl bg-gradient-to-r from-green-600 to-teal-500 px-6 py-16 text-center shadow-xl sm:p-16"
            >
                <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
                    Ready to take control of your nutrition?
                </h2>
                <p class="mx-auto mt-6 max-w-xl text-lg text-green-50">
                    Sign up today and start your journey towards a healthier lifestyle with accurate sugar
                    tracking and personalized insights.
                </p>
                <div class="mt-10 flex flex-wrap justify-center gap-4">
                    <a
                        href="/register"
                        class="rounded-md bg-white px-8 py-3 font-medium text-green-700 shadow-md hover:bg-gray-100"
                    >
                        Sign Up Free
                    </a>
                    <a
                        href="/dashboard"
                        class="rounded-md border-2 border-white px-8 py-3 font-medium text-white hover:bg-white hover:text-green-600"
                    >
                        View Demo
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .bg-grid-pattern {
        background-image: linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
    }
</style>
