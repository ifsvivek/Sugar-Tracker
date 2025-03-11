import { redirect } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { verifyToken } from '$lib/auth';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export async function load({ cookies, fetch }) {
	// Check if user is authenticated
	const token = cookies.get('authToken');

	if (!token) {
		throw redirect(302, '/login');
	}

	try {
		const decoded = verifyToken(token);

		if (!decoded || !decoded.userId) {
			cookies.delete('authToken', { path: '/' });
			throw redirect(302, '/login');
		}

		// Get user data
		const userResult = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [
			decoded.userId
		]);

		if (userResult.rows.length === 0) {
			throw redirect(302, '/login');
		}

		// Get today's food logs with nutrients - adjusted time range to fetch all logs for the past 7 days
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
		sevenDaysAgo.setHours(0, 0, 0, 0);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const logsQuery = `
            WITH daily_logs AS (
                SELECT 
                    fl.id as log_id,
                    fl.food_item_id,
                    fl.serving_size,
                    fl.meal_type,
                    fl.consumed_at,
                    fi.name as food_name,
                    fi.brand_name,
                    fi.category
                FROM food_logs fl
                JOIN food_items fi ON fl.food_item_id = fi.id
                WHERE fl.user_id = $1 
                    AND fl.consumed_at >= $2
                ORDER BY fl.consumed_at DESC
            )
            SELECT 
                dl.*,
                json_agg(
                    json_build_object(
                        'nutrient_id', fn.nutrient_id,
                        'amount', fn.amount,
                        'name', n.name,
                        'unit', n.unit
                    )
                ) as nutrients
            FROM daily_logs dl
            LEFT JOIN food_nutrients fn ON dl.food_item_id = fn.food_item_id
            LEFT JOIN nutrients n ON fn.nutrient_id = n.id
            GROUP BY 
                dl.log_id, 
                dl.food_item_id, 
                dl.serving_size, 
                dl.meal_type,
                dl.consumed_at,
                dl.food_name,
                dl.brand_name,
                dl.category
            ORDER BY dl.consumed_at DESC
        `;

		const logsResult = await pool.query(logsQuery, [decoded.userId, sevenDaysAgo]);

		// Process the food logs and calculate today's totals
		const foodLogs = logsResult.rows.map((log) => ({
			...log,
			nutrients: log.nutrients && log.nutrients[0] ? log.nutrients : [],
			sugar_amount: getNutrientAmount(log.nutrients, 1),
			carbs_amount: getNutrientAmount(log.nutrients, 2),
			protein_amount: getNutrientAmount(log.nutrients, 3),
			fat_amount: getNutrientAmount(log.nutrients, 4),
			fiber_amount: getNutrientAmount(log.nutrients, 5)
		}));

		// Filter for today's logs to calculate daily totals
		const todayLogs = foodLogs.filter((log) => {
			const logDate = new Date(log.consumed_at);
			return logDate >= today && logDate < tomorrow;
		});

		// Calculate daily nutrient totals
		const totalSugar = calculateNutrientTotal(todayLogs, 1);
		const totalCarbs = calculateNutrientTotal(todayLogs, 2);
		const totalProtein = calculateNutrientTotal(todayLogs, 3);
		const totalFat = calculateNutrientTotal(todayLogs, 4);
		const totalFiber = calculateNutrientTotal(todayLogs, 5);

		// Get user's nutrition goals
		const goalsQuery = `
      SELECT 
        ng.nutrient_id,
        ng.target_amount,
        ng.is_minimum,
        n.name as nutrient_name,
        n.unit
      FROM nutrition_goals ng
      JOIN nutrients n ON ng.nutrient_id = n.id
      WHERE ng.user_id = $1
    `;

		const goalsResult = await pool.query(goalsQuery, [decoded.userId]);

		// Get sugar goal
		const sugarGoal = goalsResult.rows.find((g) => g.nutrient_id === 1)?.target_amount || 25;

		return {
			user: userResult.rows[0],
			isAuthenticated: true,
			foodLogs,
			totalSugar,
			totalCarbs,
			totalProtein,
			totalFat,
			totalFiber,
			sugarGoal,
			goals: goalsResult.rows
		};
	} catch (error) {
		console.error('Error fetching dashboard data:', error);
		throw redirect(302, '/login');
	}
}

// Helper function to get nutrient amount
function getNutrientAmount(nutrients, nutrientId) {
	if (!nutrients || !Array.isArray(nutrients)) return 0;
	const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
	return nutrient ? parseFloat(nutrient.amount) : 0;
}

// Helper function to calculate total nutrient amount
function calculateNutrientTotal(logs, nutrientId) {
	return (
		Math.round(
			logs.reduce((sum, log) => {
				const amount = getNutrientAmount(log.nutrients, nutrientId);
				return sum + amount * log.serving_size;
			}, 0) * 10
		) / 10
	);
}

function getSugarAmount(nutrients) {
	if (!Array.isArray(nutrients)) return 0;
	const sugarNutrient = nutrients.find((n) => n.nutrient_id === 1);
	return sugarNutrient ? sugarNutrient.amount : 0;
}
