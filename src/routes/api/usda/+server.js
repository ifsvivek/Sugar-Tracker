import { json } from '@sveltejs/kit';
import { USDA_API_KEY } from '$env/static/private';
import { verifyToken } from '$lib/auth';

const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export async function POST({ request, cookies }) {
	// Verify authentication
	const token = cookies.get('authToken');
	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		verifyToken(token);
		const { action, query, fdcId, pageSize = 20, pageNumber = 1 } = await request.json();

		switch (action) {
			case 'search':
				if (!query) {
					return json({ error: 'Query parameter is required' }, { status: 400 });
				}
				return json(await searchFoods(query, pageSize, pageNumber));

			case 'details':
				if (!fdcId) {
					return json({ error: 'Food ID is required' }, { status: 400 });
				}
				return json(await getFoodDetails(fdcId));

			default:
				return json({ error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('USDA API error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}

async function searchFoods(query, pageSize, pageNumber) {
	try {
		if (!USDA_API_KEY) {
			console.error('USDA_API_KEY is not defined');
			throw new Error('API configuration error');
		}

		// Build URL with API key
		const params = new URLSearchParams({
			query: query.trim()
		});

		const url = `${API_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&${params.toString()}`;
		console.log('Search URL:', url.replace(USDA_API_KEY, '[HIDDEN]'));

		// Use GET method for the search endpoint
		const response = await fetch(url);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('USDA API Error Response:', errorText);
			throw new Error(`API response error: ${response.status} - ${errorText}`);
		}

		const data = await response.json();
		console.log('USDA API Response:', JSON.stringify(data).slice(0, 200) + '...');
		return data;
	} catch (error) {
		console.error('USDA API Error:', error);
		throw error;
	}
}

async function getFoodDetails(fdcId) {
	try {
		if (!USDA_API_KEY) {
			console.error('USDA_API_KEY is not defined');
			throw new Error('API configuration error');
		}

		const params = new URLSearchParams({
			api_key: USDA_API_KEY
		});

		// Fix the URL format to match the working pattern
		const url = `${API_BASE_URL}/food/${fdcId}?${params.toString()}`;
		console.log('Details URL:', url.replace(USDA_API_KEY, '[HIDDEN]'));

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
		console.log('Food Details Response:', JSON.stringify(data).slice(0, 200) + '...');
		return data;
	} catch (error) {
		console.error('USDA API Error:', error);
		throw error;
	}
}
