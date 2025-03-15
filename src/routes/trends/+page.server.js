import { redirect } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';

const pool = createPool({
	connectionString: POSTGRES_URL
});

export async function load({ parent }) {
	// Get authentication status from the parent layout
	const { isAuthenticated, user } = await parent();

	if (!isAuthenticated) {
		// Redirect to home page if not authenticated
		throw redirect(302, '/home');
	}

	try {
		// User is already verified in the layout, no need to check token again
		const userId = user.id;
		
		// Get the past 7 days date range
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		
		const sevenDaysAgo = new Date(today);
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days including today
		
		// Format dates for display
		const dayLabels = [];
		const currentDate = new Date(sevenDaysAgo);
		
		for (let i = 0; i < 7; i++) {
			dayLabels.push(currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
			currentDate.setDate(currentDate.getDate() + 1);
		}
		
		// Get food logs for the past 7 days
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
                    AND fl.consumed_at < $3
                ORDER BY fl.consumed_at ASC
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
            ORDER BY dl.consumed_at ASC
        `;

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		
		const logsResult = await pool.query(logsQuery, [userId, sevenDaysAgo, tomorrow]);
		
		// Process the food logs
		const foodLogs = logsResult.rows.map((log) => ({
			...log,
			nutrients: log.nutrients?.filter(n => n !== null) || [],
			sugar_amount: getNutrientAmount(log.nutrients, 1),
			carbs_amount: getNutrientAmount(log.nutrients, 2),
			protein_amount: getNutrientAmount(log.nutrients, 3),
			fat_amount: getNutrientAmount(log.nutrients, 4),
			fiber_amount: getNutrientAmount(log.nutrients, 5),
			sodium_amount: getNutrientAmount(log.nutrients, 6),
			calories_amount: calculateCalories(log.nutrients)
		}));
		
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
		
		// Calculate daily totals for the past 7 days
		const dailyNutrients = [];
		const sugarData = Array(7).fill(0);
		const calorieData = Array(7).fill(0);
		const carbsData = Array(7).fill(0);
		const proteinData = Array(7).fill(0);
		const fatData = Array(7).fill(0);
		const fiberData = Array(7).fill(0);
		
		// Initialize meal breakdown data
		const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
		const mealBreakdown = mealTypes.map(type => ({
			name: type.charAt(0).toUpperCase() + type.slice(1),
			sugar: 0,
			percentage: 0
		}));
		
		// Process daily totals
		for (let i = 0; i < 7; i++) {
			const dateToCheck = new Date(sevenDaysAgo);
			dateToCheck.setDate(dateToCheck.getDate() + i);
			const nextDay = new Date(dateToCheck);
			nextDay.setDate(nextDay.getDate() + 1);
			
			// Filter logs for this day
			const dayLogs = foodLogs.filter(log => {
				const logDate = new Date(log.consumed_at);
				return logDate >= dateToCheck && logDate < nextDay;
			});
			
			// Calculate daily totals
			let dailySugar = 0;
			let dailyCalories = 0;
			let dailyCarbs = 0;
			let dailyProtein = 0;
			let dailyFat = 0;
			let dailyFiber = 0;
			
			dayLogs.forEach(log => {
				const serving = log.serving_size || 1;
				
				dailySugar += log.sugar_amount * serving;
				dailyCalories += log.calories_amount * serving;
				dailyCarbs += log.carbs_amount * serving;
				dailyProtein += log.protein_amount * serving;
				dailyFat += log.fat_amount * serving;
				dailyFiber += log.fiber_amount * serving;
				
				// Add to meal breakdown
				if (log.meal_type) {
					const mealType = log.meal_type.toLowerCase();
					const mealIndex = mealTypes.indexOf(mealType);
					if (mealIndex !== -1) {
						mealBreakdown[mealIndex].sugar += log.sugar_amount * serving;
					}
				}
			});
			
			// Store daily totals in arrays
			sugarData[i] = parseFloat(dailySugar.toFixed(1));
			calorieData[i] = Math.round(dailyCalories);
			carbsData[i] = parseFloat(dailyCarbs.toFixed(1));
			proteinData[i] = parseFloat(dailyProtein.toFixed(1));
			fatData[i] = parseFloat(dailyFat.toFixed(1));
			fiberData[i] = parseFloat(dailyFiber.toFixed(1));
			
			// Store for daily nutrients array
			dailyNutrients.push({
				date: dateToCheck.toISOString(),
				sugar: parseFloat(dailySugar.toFixed(1)),
				calories: Math.round(dailyCalories),
				carbs: parseFloat(dailyCarbs.toFixed(1)),
				protein: parseFloat(dailyProtein.toFixed(1)),
				fat: parseFloat(dailyFat.toFixed(1)),
				fiber: parseFloat(dailyFiber.toFixed(1))
			});
		}
		
		// Calculate total sugar from all logs for meal percentage
		const totalSugar = foodLogs.reduce((sum, log) => sum + log.sugar_amount * log.serving_size, 0);
		
		// Calculate percentages for meal breakdown
		if (totalSugar > 0) {
			mealBreakdown.forEach(meal => {
				meal.percentage = Math.round((meal.sugar / totalSugar) * 100);
				meal.sugar = parseFloat(meal.sugar.toFixed(1));
			});
		}
		
		// Calculate today's totals
		const todayLogs = foodLogs.filter(log => {
			const logDate = new Date(log.consumed_at);
			return logDate >= today && logDate < tomorrow;
		});
		
		const totalSugarToday = todayLogs.reduce((sum, log) => sum + log.sugar_amount * log.serving_size, 0);
		const totalCarbsToday = todayLogs.reduce((sum, log) => sum + log.carbs_amount * log.serving_size, 0);
		const totalProteinToday = todayLogs.reduce((sum, log) => sum + log.protein_amount * log.serving_size, 0);
		const totalFatToday = todayLogs.reduce((sum, log) => sum + log.fat_amount * log.serving_size, 0);
		const totalFiberToday = todayLogs.reduce((sum, log) => sum + log.fiber_amount * log.serving_size, 0);
		
		// Return data for the trends page
		return {
			foodLogs,
			totalSugar: parseFloat(totalSugarToday.toFixed(1)),
			totalCarbs: parseFloat(totalCarbsToday.toFixed(1)),
			totalProtein: parseFloat(totalProteinToday.toFixed(1)),
			totalFat: parseFloat(totalFatToday.toFixed(1)),
			totalFiber: parseFloat(totalFiberToday.toFixed(1)),
			sugarGoal,
			goals: goalsResult.rows,
			weeklyData: {
				labels: dayLabels,
				sugarData,
				calorieData,
				carbsData,
				proteinData,
				fatData,
				fiberData,
				mealBreakdown,
				dailyNutrients,
				monthlyTrend: {
					currentMonthAvg: calculateAverage(sugarData),
					previousMonthAvg: calculateAverage(sugarData) * 1.2, // Simulated previous month data
					percentChange: 20, // Simulated 20% decrease
					hasData: sugarData.some(value => value > 0)
				}
			}
		};
	} catch (error) {
		console.error('Error loading trends page:', error);
		
		// Return empty data to prevent errors
		return {
			foodLogs: [],
			totalSugar: 0,
			totalCarbs: 0,
			totalProtein: 0,
			totalFat: 0,
			totalFiber: 0,
			sugarGoal: 25,
			goals: [],
			weeklyData: {
				labels: [],
				sugarData: [],
				calorieData: [],
				carbsData: [],
				proteinData: [],
				fatData: [],
				fiberData: [],
				mealBreakdown: [],
				dailyNutrients: [],
				monthlyTrend: {
					currentMonthAvg: 0,
					previousMonthAvg: 0,
					percentChange: 0,
					hasData: false
				}
			}
		};
	}
}

// Helper function to get nutrient amount
function getNutrientAmount(nutrients, nutrientId) {
	if (!nutrients || !Array.isArray(nutrients)) return 0;
	const nutrient = nutrients.find((n) => n.nutrient_id === nutrientId);
	return nutrient ? parseFloat(nutrient.amount) : 0;
}

// Calculate calories based on macronutrients
function calculateCalories(nutrients) {
	if (!nutrients || !Array.isArray(nutrients)) return 0;
	
	const carbs = getNutrientAmount(nutrients, 2);
	const protein = getNutrientAmount(nutrients, 3);
	const fat = getNutrientAmount(nutrients, 4);
	
	return (carbs * 4) + (protein * 4) + (fat * 9);
}

// Calculate average of an array with number values
function calculateAverage(arr) {
	if (!arr.length) return 0;
	const sum = arr.reduce((acc, val) => acc + val, 0);
	return parseFloat((sum / arr.length).toFixed(1));
}
