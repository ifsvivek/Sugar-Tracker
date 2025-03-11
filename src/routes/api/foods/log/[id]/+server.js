import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { verifyToken } from '$lib/auth';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export async function DELETE({ params, cookies }) {
	// Verify authentication
	const token = cookies.get('authToken');
	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = verifyToken(token);
		const userId = decoded.userId;
		const logId = params.id;

		if (!logId) {
			return json({ error: 'Missing log ID' }, { status: 400 });
		}

		// Delete the log
		const client = await pool.connect();
		try {
			await client.query('BEGIN');

			// Check if the log belongs to the user
			const checkResult = await client.query(
				'SELECT * FROM food_logs WHERE id = $1 AND user_id = $2',
				[logId, userId]
			);

			if (checkResult.rows.length === 0) {
				return json({ error: 'Log not found or not authorized' }, { status: 404 });
			}

			// Delete the log
			await client.query('DELETE FROM food_logs WHERE id = $1', [logId]);

			await client.query('COMMIT');

			return json({ success: true, message: 'Food log deleted successfully' });
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Database error:', error);
			throw error;
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Error deleting food log:', error);
		return json({ error: error.message || 'Failed to delete food log' }, { status: 500 });
	}
}
