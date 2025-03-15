import { isAuthenticated } from '$lib/auth';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { verifyToken } from '$lib/auth';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export async function load({ cookies, url, locals }) {
	const authToken = cookies.get('authToken');
	const isAuth = isAuthenticated(cookies);
	
	// Track the requested URL for proper redirects after login
	const requestedPath = url.pathname;

	// If not authenticated, just return the auth status and requested path
	if (!isAuth) {
		return {
			isAuthenticated: false,
			requestedPath
		};
	}

	// If authenticated, get user data
	try {
		const decoded = verifyToken(authToken);

		if (decoded && decoded.userId) {
			const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [
				decoded.userId
			]);

			if (result.rows.length > 0) {
				// Set user in locals for server-side access
				const userData = result.rows[0];
				locals.user = userData;
				
				return {
					isAuthenticated: true,
					user: userData,
					requestedPath
				};
			}
		}
	} catch (error) {
		console.error('Error fetching user data in layout:', error);
	}

	// Default return if something goes wrong
	return {
		isAuthenticated: isAuth,
		requestedPath
	};
}
