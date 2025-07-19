import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	// Set the 'Cache-Control' header to prevent caching of the response
	event.setHeaders({ 'Cache-Control': 'no-store' });

	// Get the origin of the current request
	const host = event.url.origin;

	// Retrieve the Discord access and refresh tokens from cookies
	const access_token = event.cookies.get('discord_access_token') || '';
	const refresh_token = event.cookies.get('discord_refresh_token') || '';

	// Store the tokens in the locals object for use in other parts of the application
	event.locals.discord_access_token = access_token;
	event.locals.discord_refresh_token = refresh_token;

	// If there is a refresh token but no access token, attempt to refresh the access token
	if (refresh_token && !access_token) {
		// Make a request to the /api/refresh endpoint with the refresh token
		const discord_request = await fetch(`${host}/api/refresh?code=${refresh_token}`);

		// If the refresh request fails, resolve the event without modifying the response
		if (discord_request.status !== 200) {
			return await resolve(event);
		}

		// Parse the response from the refresh request
		const discord_response = await discord_request.json();

		// Update the locals object with the new access and refresh tokens
		event.locals.discord_access_token = discord_response.access_token;
		event.locals.discord_refresh_token = discord_response.refresh_token;

		// Set the new access token in the cookies with a max age of 600 seconds (10 minutes)
		event.cookies.set('discord_access_token', discord_response.access_token, {
			secure: !dev, // Use secure cookies in production
			httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
			path: '/', // Make the cookie available to all routes
			maxAge: 604800 // Set the cookie to expire in 7 days
		});

		// Set the new refresh token in the cookies with an expiration date of 30 days
		event.cookies.set('discord_refresh_token', discord_response.refresh_token, {
			secure: !dev, // Use secure cookies in production
			httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
			path: '/', // Make the cookie available to all routes
			maxAge: 604800 // Set the cookie to expire in 7 days
		});
	}

	// Resolve the event and continue with the request
	return await resolve(event);
};