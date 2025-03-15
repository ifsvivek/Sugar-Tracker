/**
 * Search for food items in the USDA database
 * @param {string} query - The search term
 * @param {number} pageSize - Number of results to return (default: 20)
 * @param {number} pageNumber - Page number for pagination (default: 1)
 * @returns {Promise<Object>} - Search results
 */
export async function searchFoods(query, pageSize = 20, pageNumber = 1) {
	// In browser context, we use absolute URLs
	const url = `${location.origin}/api/foods/search`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query,
			pageSize,
			pageNumber
		})
	});

	if (!response.ok) {
		throw new Error('Failed to search foods');
	}

	return response.json();
}

/**
 * Get detailed information for a specific food item
 * @param {string} fdcId - The FDC ID of the food
 * @returns {Promise<Object>} - Food details
 */
export async function getFoodDetails(fdcId) {
	// In browser context, we use absolute URLs
	const url = `${location.origin}/api/usda`;

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			action: 'details',
			fdcId
		})
	});

	if (!response.ok) {
		throw new Error('Failed to get food details');
	}

	return response.json();
}

export function processUsdaNutrients(foodData) {
    if (!foodData || !foodData.foodNutrients) {
        return [];
    }

    const nutrientMappings = {
        // Sugar (multiple possible IDs)
        '269': 1,    // Sugars, total
        '539': 1,    // Sugars, added
        '2000': 1,   // Sugars
        
        // Carbohydrates
        '205': 2,    // Carbohydrates, total
        '1005': 2,   // Carbohydrate, by difference
        
        // Protein
        '203': 3,    // Protein
        '1003': 3,   // Protein
        
        // Fat
        '204': 4,    // Total Fat
        '1004': 4,   // Total lipid (fat)
        
        // Fiber
        '291': 5,    // Fiber, total dietary
        '1079': 5,   // Fiber, total dietary
        
        // Sodium
        '307': 6,    // Sodium, Na
        '1093': 6    // Sodium
    };

    return foodData.foodNutrients
        .filter(nutrient => {
            const id = nutrient.nutrient?.number || nutrient.number || 
                      nutrient.nutrientNumber?.toString() || '';
            return nutrientMappings[id] !== undefined;
        })
        .map(nutrient => {
            const id = nutrient.nutrient?.number || nutrient.number || 
                      nutrient.nutrientNumber?.toString() || '';
            const nutrientId = nutrientMappings[id];
            const amount = nutrient.amount || nutrient.value || 0;

            return {
                nutrient_id: nutrientId,
                amount: parseFloat(amount),
                unit: getUnitForNutrient(nutrientId)
            };
        });
}

function getUnitForNutrient(nutrientId) {
    const units = {
        1: 'g',  // Sugar
        2: 'g',  // Carbs
        3: 'g',  // Protein
        4: 'g',  // Fat
        5: 'g',  // Fiber
        6: 'mg', // Sodium
    };
    return units[nutrientId] || 'g';
}
