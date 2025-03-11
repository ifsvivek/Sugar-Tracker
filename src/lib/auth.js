import { createPool } from '@vercel/postgres';
import { POSTGRES_URL, JWT_SECRET } from '$env/static/private';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Explicitly pass the connection string to make it clearer
const pool = createPool({
	connectionString: POSTGRES_URL
});

export async function registerUser(name, email, password) {
	const hashedPassword = await bcrypt.hash(password, 10);
	try {
		// Check if user already exists
		const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
		if (result.rows.length > 0) {
			return { success: false, error: 'Email already registered' };
		}

		// Insert new user with password_hash instead of password
		await pool.query(
			`INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)`,
			[name, email, hashedPassword]
		);
		return { success: true };
	} catch (error) {
		console.error('Registration error:', error);
		return { success: false, error: 'Registration failed' };
	}
}

export async function loginUser(email, password) {
	try {
		// Updated to use id instead of user_id and password_hash instead of password
		const result = await pool.query(
			`SELECT id, name, email, password_hash
             FROM users
             WHERE email = $1`,
			[email]
		);

		const user = result.rows[0];
		if (!user) {
			return { success: false, error: 'User not found' };
		}

		// Compare with password_hash instead of password
		const validPassword = await bcrypt.compare(password, user.password_hash);
		if (!validPassword) {
			return { success: false, error: 'Invalid password' };
		}

		const userData = {
			id: user.id,
			name: user.name,
			email: user.email
		};

		// Use user.id instead of user.user_id for the JWT
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

		return {
			success: true,
			token,
			user: userData
		};
	} catch (error) {
		console.error('Login error:', error);
		return { success: false, error: 'Login failed' };
	}
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
}

// Add new function to check authentication status
export function isAuthenticated(cookies) {
	const token = cookies.get('authToken');
	if (!token) return false;

	const decoded = verifyToken(token);
	return !!decoded && !!decoded.userId;
}
