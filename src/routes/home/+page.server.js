import { isAuthenticated } from '$lib/auth';

export function load({ cookies }) {
	// Pass authentication status to the page
	return {
		isAuthenticated: isAuthenticated(cookies)
	};
}
