import { json } from '@sveltejs/kit';
import { verifyToken } from '$lib/auth';
import { USDA_API_KEY } from '$env/static/private';

const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export async function POST({ request, cookies, fetch }) {
	// Verify authentication
	const token = cookies.get('authToken');
	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		verifyToken(token);

		const { query, pageSize, pageNumber } = await request.json();

		if (!query) {
			return json({ error: 'Query parameter is required' }, { status: 400 });
		}

		// Use direct USDA API call with event.fetch
		const params = new URLSearchParams({
			api_key: USDA_API_KEY,
			query: query.trim()
		});

		const url = `${API_BASE_URL}/foods/search?${params.toString()}`;
		// console.log('Search URL:', url.replace(USDA_API_KEY, '[HIDDEN]'));

		const response = await fetch(url);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('USDA API Error Response:', errorText);
			throw new Error(`API response error: ${response.status} - ${errorText}`);
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		console.error('Search error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}
