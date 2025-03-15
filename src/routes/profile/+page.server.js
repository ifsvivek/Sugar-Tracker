import { redirect } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({
	connectionString: POSTGRES_URL
});

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, parent }) {
	// Get the parent layout data which contains authentication info
	const parentData = await parent();

	// Redirect if not logged in
	if (!parentData.isAuthenticated || !locals.user) {
		throw redirect(302, '/login?redirectTo=/profile');
	}

	const userId = locals.user.id;

	try {
		// Fetch user's nutrition goals
		const goalsQuery = `
      SELECT 
        ng.nutrient_id,
        n.name,
        n.unit,
        ng.target_amount,
        ng.is_minimum
      FROM nutrition_goals ng
      JOIN nutrients n ON ng.nutrient_id = n.id
      WHERE ng.user_id = $1
      ORDER BY n.name
    `;
		
		const goalsResult = await pool.query(goalsQuery, [userId]);

		return {
			goals: goalsResult.rows,
			user: locals.user // Explicitly pass user data to the page
		};
	} catch (error) {
		console.error('Error loading profile data:', error);
		return {
			goals: [],
			user: locals.user // Ensure user data is always passed
		};
	}
}
