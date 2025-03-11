import { isAuthenticated } from '$lib/auth';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { verifyToken } from '$lib/auth';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export async function load({ cookies }) {
	const authToken = cookies.get('authToken');
	const isAuth = isAuthenticated(cookies);

	// If not authenticated, just return the auth status
	if (!isAuth) {
		return {
			isAuthenticated: false
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
				return {
					isAuthenticated: true,
					user: result.rows[0]
				};
			}
		}
	} catch (error) {
		console.error('Error fetching user data in layout:', error);
	}

	// Default return if something goes wrong
	return {
		isAuthenticated: isAuth
	};
}
