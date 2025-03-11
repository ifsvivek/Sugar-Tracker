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
