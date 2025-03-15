import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import bcrypt from 'bcryptjs';

const pool = createPool({
	connectionString: POSTGRES_URL
});

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals, cookies }) {
	try {
		// Check if user is authenticated
		if (!locals.user) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const userId = locals.user.id;
		const data = await request.json();
		const { name, currentPassword, newPassword } = data;

		// Update user profile
		if (newPassword) {
			// If changing password, verify current password first
			const userResult = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
			
			if (userResult.rows.length === 0) {
				return json({ error: 'User not found' }, { status: 404 });
			}

			const validPassword = await bcrypt.compare(currentPassword, userResult.rows[0].password);
			
			if (!validPassword) {
				return json({ error: 'Current password is incorrect' }, { status: 400 });
			}

			// Hash the new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(newPassword, salt);

			// Update name and password
			await pool.query(
				'UPDATE users SET name = $1, password = $2 WHERE id = $3',
				[name, hashedPassword, userId]
			);
		} else {
			// Only update name
			await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, userId]);
		}

		// Update session data with new name
		locals.user.name = name;

		return json({ 
			success: true,
			user: {
				id: locals.user.id,
				name: name,
				email: locals.user.email
			}
		});
	} catch (error) {
		console.error('Error updating profile:', error);
		return json({ error: 'Failed to update profile' }, { status: 500 });
	}
}
