import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch, parent }) {
	// Get auth data from parent layout
	const { isAuthenticated: isAuth, user } = await parent();
	
	// Check if user is authenticated
	if (!isAuth) {
		// Save the current URL for redirect after login
		throw redirect(302, `/login?redirectTo=/log`);
	}
	
	// Fetch recent foods for this user to suggest
	// This is a placeholder for your actual API call
	const recentFoods = await fetchRecentFoods(user.id); 
	
	return {
		recentFoods
	};
}

// Helper function to fetch recent foods
async function fetchRecentFoods(userId) {
	// This would be replaced by your actual database query
	// Returning mock data for now
	return [
		{ id: 1, name: 'Apple', servingSize: 1, sugar: 10 },
		{ id: 2, name: 'Banana', servingSize: 1, sugar: 14 },
		{ id: 3, name: 'Orange Juice', servingSize: 1, sugar: 22 },
		{ id: 4, name: 'Greek Yogurt', servingSize: 1, sugar: 5 }
	];
}
