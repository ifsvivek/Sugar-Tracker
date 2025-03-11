import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
	// Clear the authentication cookie
	cookies.delete('authToken', { path: '/' });

	return json({ success: true });
}
