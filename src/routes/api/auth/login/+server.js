import { json } from '@sveltejs/kit';
import { loginUser } from '$lib/auth';

export async function POST({ request, cookies }) {
	try {
		const data = await request.json();
		const { email, password, redirectTo } = data;
		
		const result = await loginUser(email, password);
		
		if (!result.success) {
			return json({ success: false, error: result.error }, { status: 401 });
		}
		
		// Set authentication cookie with proper attributes
		cookies.set('authToken', result.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 // 1 day in seconds
		});
		
		return json({ 
			success: true, 
			user: result.user,
			redirectTo: redirectTo || '/'
		});
	} catch (error) {
		console.error('Login API error:', error);
		return json({ success: false, error: 'An unexpected error occurred' }, { status: 500 });
	}
}
