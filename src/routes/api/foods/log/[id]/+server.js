import { error, json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { verifyToken } from '$lib/auth';

const pool = createPool({
    connectionString: POSTGRES_URL
});

export async function DELETE({ params, cookies }) {
    const authToken = cookies.get('authToken');
    
    if (!authToken) {
        throw error(401, 'Authentication required');
    }

    try {
        const decoded = verifyToken(authToken);
        if (!decoded || !decoded.userId) {
            throw error(401, 'Invalid authentication token');
        }

        const logId = params.id;
        const userId = decoded.userId;

        // First verify the log belongs to the user
        const checkQuery = 'SELECT user_id FROM food_logs WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [logId]);

        if (checkResult.rows.length === 0) {
            throw error(404, 'Log entry not found');
        }

        if (checkResult.rows[0].user_id !== userId) {
            throw error(403, 'Unauthorized to delete this log');
        }

        // Delete the log
        const deleteQuery = 'DELETE FROM food_logs WHERE id = $1 AND user_id = $2';
        await pool.query(deleteQuery, [logId, userId]);

        return json({ success: true });
    } catch (err) {
        console.error('Error deleting food log:', err);
        throw error(500, 'Failed to delete food log');
    }
}
