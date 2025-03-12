import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { verifyToken } from '$lib/auth';

const pool = createPool({
	connectionString: POSTGRES_URL
});

// POST /api/goals - Save user nutrition goals
export async function POST({ request, cookies }) {
	const token = cookies.get('authToken');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = verifyToken(token);
		if (!decoded || !decoded.userId) {
			return json({ error: 'Invalid token' }, { status: 401 });
		}

		const { goals } = await request.json();

		if (!Array.isArray(goals)) {
			return json({ error: 'Invalid goals data' }, { status: 400 });
		}

		// Begin transaction
		const client = await pool.connect();

		try {
			await client.query('BEGIN');

			// Process each goal
			for (const goal of goals) {
				const { nutrient_id, target_amount, is_minimum } = goal;

				// Use upsert to either update existing goal or insert new one
				const query = `
					INSERT INTO nutrition_goals (user_id, nutrient_id, target_amount, is_minimum)
					VALUES ($1, $2, $3, $4)
					ON CONFLICT (user_id, nutrient_id) 
					DO UPDATE SET 
						target_amount = $3,
						is_minimum = $4
				`;

				await client.query(query, [decoded.userId, nutrient_id, target_amount, is_minimum]);
			}

			await client.query('COMMIT');
			return json({ success: true });
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Error saving goals:', error);
			return json({ error: 'Failed to save goals' }, { status: 500 });
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Error processing goal request:', error);
		return json({ error: 'Server error' }, { status: 500 });
	}
}
