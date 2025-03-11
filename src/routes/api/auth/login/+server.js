import { json } from '@sveltejs/kit';
import { loginUser } from '$lib/auth';

export async function POST({ request, cookies }) {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ success: false, error: 'Email and password are required' }, { status: 400 });
	}

	const result = await loginUser(email, password);

	if (result.success) {
		// Set authentication cookie
		cookies.set('authToken', result.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 // 1 day
		});

		return json({
			success: true,
			user: result.user
		});
	} else {
		return json({ success: false, error: result.error }, { status: 401 });
	}
}
