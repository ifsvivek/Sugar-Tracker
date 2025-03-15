import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({
	connectionString: POSTGRES_URL
});

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ locals }) {
	try {
		// Check if user is authenticated
		if (!locals.user) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const userId = locals.user.id;

		// Start a transaction to ensure all deletions happen together
		const client = await pool.connect();
		try {
			await client.query('BEGIN');

			// Delete user's goals
			await client.query('DELETE FROM nutrition_goals WHERE user_id = $1', [userId]);

			// Delete user's food logs
			await client.query('DELETE FROM food_logs WHERE user_id = $1', [userId]);

			// Delete any custom foods created by the user
			await client.query('DELETE FROM foods WHERE created_by_user_id = $1', [userId]);

			// Delete the user account itself
			await client.query('DELETE FROM users WHERE id = $1', [userId]);

			await client.query('COMMIT');
		} catch (error) {
			await client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}

		// Clear session
		locals.user = null;

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting account:', error);
		return json({ error: 'Failed to delete account' }, { status: 500 });
	}
}
