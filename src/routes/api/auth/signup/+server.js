import { json } from '@sveltejs/kit';
import { registerUser } from '$lib/auth';

export async function POST({ request }) {
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
		return json({ success: true });
	} else {
		return json({ success: false, error: result.error }, { status: 400 });
	}
}
