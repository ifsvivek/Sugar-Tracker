import { json } from '@sveltejs/kit';
import { createPool } from '@vercel/postgres';
import { POSTGRES_URL } from '$env/static/private';
import { verifyToken } from '$lib/auth';
import { USDA_API_KEY } from '$env/static/private';

const pool = createPool({
	connectionString: POSTGRES_URL
});

const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export async function POST({ request, cookies, fetch }) {
	// Verify authentication
	const token = cookies.get('authToken');
	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const decoded = verifyToken(token);
		const userId = decoded.userId;

		const { fdcId, servingSize, mealType } = await request.json();

		if (!fdcId || !servingSize || !mealType) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Get food details directly from USDA using event.fetch
		const foodDetails = await getFoodDetails(fdcId, fetch);

		// Begin transaction
		const client = await pool.connect();
		try {
			await client.query('BEGIN');

			// Check if food item already exists
			const foodResult = await client.query('SELECT id FROM food_items WHERE usda_fdc_id = $1', [
				fdcId
			]);

			let foodItemId;
			if (foodResult.rows.length > 0) {
				foodItemId = foodResult.rows[0].id;
			} else {
				// Insert new food item
				const insertFoodResult = await client.query(
					'INSERT INTO food_items (usda_fdc_id, name, brand_name, category, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id',
					[
						fdcId,
						foodDetails.description,
						foodDetails.brandName || null,
						foodDetails.foodCategory || null,
						userId
					]
				);
				foodItemId = insertFoodResult.rows[0].id;

				// Extract and insert nutrients
				if (foodDetails.foodNutrients) {
					const nutrientMap = {
						'Sugars, total including NLEA': 1,
						'Sugars, added': 1,
						'Sugars, Total': 1,
						'Total Sugars': 1,
						'Carbohydrate, by difference': 2,
						Protein: 3,
						'Total lipid (fat)': 4,
						'Fatty acids, total saturated': 4,
						'Fiber, total dietary': 5,
						'Sodium, Na': 6
					};

					for (const nutrient of foodDetails.foodNutrients) {
						const nutrientName = nutrient.nutrientName || nutrient.nutrient?.name;
						const nutrientId = nutrientMap[nutrientName];

						if (nutrientId && nutrient.amount) {
							await client.query(
								'INSERT INTO food_nutrients (food_item_id, nutrient_id, amount) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
								[foodItemId, nutrientId, nutrient.amount]
							);
						}
					}
				}
			}

			// Log the food
			await client.query(
				'INSERT INTO food_logs (user_id, food_item_id, serving_size, meal_type, consumed_at) VALUES ($1, $2, $3, $4, $5)',
				[userId, foodItemId, servingSize, mealType, new Date()]
			);

			await client.query('COMMIT');

			return json({ success: true, message: 'Food logged successfully' });
		} catch (error) {
			await client.query('ROLLBACK');
			console.error('Database error:', error);
			throw error;
		} finally {
			client.release();
		}
	} catch (error) {
		console.error('Error logging food:', error);
		return json({ error: error.message || 'Failed to log food' }, { status: 500 });
	}
}

// Moved the getFoodDetails function here to use event.fetch
async function getFoodDetails(fdcId, fetch) {
	try {
		if (!USDA_API_KEY) {
			console.error('USDA_API_KEY is not defined');
			throw new Error('API configuration error');
		}

		const params = new URLSearchParams({
			api_key: USDA_API_KEY
		});

		// Use direct USDA API call instead of internal API
		const url = `${API_BASE_URL}/food/${fdcId}?${params.toString()}`;
		// console.log('Details URL:', url.replace(USDA_API_KEY, '[HIDDEN]'));

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('USDA API Error Response:', errorText);
			try {
				const errorData = JSON.parse(errorText);
				throw new Error(errorData.error?.message || `API response error: ${response.status}`);
			} catch (e) {
				throw new Error(`API response error: ${response.status} - ${errorText}`);
			}
		}

		const data = await response.json();
		// console.log('Food Details Response:', JSON.stringify(data).slice(0, 200) + '...');
		return data;
	} catch (error) {
		console.error('USDA API Error:', error);
		throw error;
	}
}
