import { redirect } from '@sveltejs/kit';
import { verifyToken } from '$lib/auth';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export async function load({ cookies, fetch, parent }) {
	// Get authentication status from the parent layout
	const { isAuthenticated, user } = await parent();

	if (!isAuthenticated) {
		// Redirect to home page if not authenticated
		throw redirect(302, '/home');
	}

	try {
		// User is already verified in the layout, no need to check token again
		const userId = user.id;

		// Get food logs for the past 7 days
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

		const logsResult = await pool.query(logsQuery, [userId, sevenDaysAgo]);

		// Process the food logs and calculate today's totals
		const foodLogs = logsResult.rows.map((log) => ({
			...log,
			nutrients: log.nutrients?.filter(n => n !== null) || [],
			sugar_amount: getNutrientAmount(log.nutrients, 1),
			carbs_amount: getNutrientAmount(log.nutrients, 2),
			protein_amount: getNutrientAmount(log.nutrients, 3),
			fat_amount: getNutrientAmount(log.nutrients, 4),
			fiber_amount: getNutrientAmount(log.nutrients, 5),
			sodium_amount: getNutrientAmount(log.nutrients, 6)
		}));

		// Filter for today's logs to calculate daily totals
		const todayLogs = foodLogs.filter((log) => {
			const logDate = new Date(log.consumed_at);
			return logDate >= today && logDate < tomorrow;
		});

		// Calculate daily nutrient totals (based strictly on today's logs)
		const totalSugar = calculateNutrientTotal(todayLogs, 1);
		const totalCarbs = calculateNutrientTotal(todayLogs, 2);
		const totalProtein = calculateNutrientTotal(todayLogs, 3);
		const totalFat = calculateNutrientTotal(todayLogs, 4);
		const totalFiber = calculateNutrientTotal(todayLogs, 5);
		const totalSodium = calculateNutrientTotal(todayLogs, 6);
		const totalCholesterol = calculateNutrientTotal(todayLogs, 7);
		const totalVitaminA = calculateNutrientTotal(todayLogs, 8);
		const totalVitaminC = calculateNutrientTotal(todayLogs, 9);
		const totalCalcium = calculateNutrientTotal(todayLogs, 10);
		const totalIron = calculateNutrientTotal(todayLogs, 11);

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

		const goalsResult = await pool.query(goalsQuery, [userId]);

		// Get sugar goal
		const sugarGoal = goalsResult.rows.find((g) => g.nutrient_id === 1)?.target_amount || 25;

		// Return data with formatted numbers
		return {
			foodLogs,
			todayLogs,
			totalSugar: Number(totalSugar.toFixed(1)),
			totalCarbs: Number(totalCarbs.toFixed(1)),
			totalProtein: Number(totalProtein.toFixed(1)),
			totalFat: Number(totalFat.toFixed(1)),
			totalFiber: Number(totalFiber.toFixed(1)),
			totalSodium: Number(totalSodium.toFixed(1)),
			sugarGoal,
			goals: goalsResult.rows,
			today: today.toISOString()
		};
	} catch (error) {
		console.error('Error loading root page:', error);
		throw redirect(302, '/home');
	}
}

// Helper function to get nutrient amount
function getNutrientAmount(nutrients, nutrientId) {
	if (!nutrients || !Array.isArray(nutrients)) return 0;
	const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
	return nutrient ? parseFloat(nutrient.amount) : 0;
}

// Update calculateNutrientTotal function
function calculateNutrientTotal(logs, nutrientId) {
    const total = logs.reduce((sum, log) => {
        const amount = getNutrientAmount(log.nutrients, nutrientId);
        return sum + (amount * log.serving_size);
    }, 0);
    return Number(total.toFixed(1)); // Format to 1 decimal place
}

// Helper function for getting goal amount with default fallback
function getGoalAmountForNutrient(goals, nutrientId, defaultAmount) {
	const goal = goals.find((g) => g.nutrient_id === nutrientId);
	return goal ? goal.target_amount : defaultAmount;
}

// Helper function to check if a goal is exceeded
function isGoalExceeded(goals, nutrientId, amount) {
	const goal = goals.find((g) => g.nutrient_id === nutrientId);
	if (!goal) return amount > getDefaultGoalForNutrient(nutrientId);
	
	return goal.is_minimum ? amount < goal.target_amount : amount > goal.target_amount;
}

// Helper function to get default goal amount
function getDefaultGoalForNutrient(nutrientId) {
	const defaultValues = {
		1: 25,    // Sugar
		2: 150,   // Carbs
		3: 60,    // Protein
		4: 50,    // Fat
		5: 25,    // Fiber
		6: 2300   // Sodium
	};
	return defaultValues[nutrientId] || 0;
}

function getSugarAmount(nutrients) {
	if (!Array.isArray(nutrients)) return 0;
	const sugarNutrient = nutrients.find((n) => n.nutrient_id === 1);
	return sugarNutrient ? sugarNutrient.amount : 0;
}
