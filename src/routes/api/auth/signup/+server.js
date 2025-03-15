import { json } from '@sveltejs/kit';
import { registerUser } from '$lib/auth';

export async function POST({ request, cookies }) {
	const { name, email, password } = await request.json();

	if (!name || !email || !password) {
		return json({ success: false, error: 'All fields are required' }, { status: 400 });
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return json({ success: false, error: 'Invalid email format' }, { status: 400 });
	}

	// Validate password strength
	if (password.length < 6) {
		return json(
			{ success: false, error: 'Password must be at least 6 characters' },
			{ status: 400 }
		);
	}

	const result = await registerUser(name, email, password);

	if (result.success) {
		// Set authentication cookie just like in login
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
		return json({ success: false, error: result.error }, { status: 400 });
	}
}
