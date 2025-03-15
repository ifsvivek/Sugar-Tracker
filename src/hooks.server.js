import { verifyToken } from '$lib/auth';

export async function handle({ event, resolve }) {
    const token = event.cookies.get('session');
    
    if (token) {
        try {
            const user = await verifyToken(token);
            // Set both user and isAuthenticated in locals
            event.locals.user = user;
            event.locals.isAuthenticated = true;
        } catch (error) {
            console.error('Auth error:', error);
            event.locals.user = null;
            event.locals.isAuthenticated = false;
        }
    } else {
        event.locals.user = null;
        event.locals.isAuthenticated = false;
    }

    const response = await resolve(event);
    return response;
}
