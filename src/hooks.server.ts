import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('=========hooks start==================')

	event.setHeaders({ 'Cache-Control': 'no-store' }); //  !!!!!needed to use cookies.set!!!!!
	const host = event.url.origin
	const access_token = event.cookies.get('dscrd_access_token') || '';
	const refresh_token = event.cookies.get('dscrd_refresh_token') || '';
	event.locals.dscrd_access_token = access_token;
	event.locals.dscrd_refresh_token = refresh_token;

	// if only refresh token is found, then access token has expired. perform a refresh on it.
	if (refresh_token && !access_token) {
		console.log('===hooks====, no access token , call refresh')
		const discord_request = await fetch(`${host}/api/refresh?code=${refresh_token}`);
		if (discord_request.status !== 200) {
			return await resolve(event);
		}
		const discord_response = await discord_request.json();

		event.locals.dscrd_access_token = discord_response.access_token;
		event.locals.dscrd_refresh_token = discord_response.refresh_token;


		const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

		event.cookies.set('dscrd_access_token', discord_response.access_token, {
			secure: !dev,
			httpOnly: true,
			path: '/',
			maxAge: 600
		});
		event.cookies.set('dscrd_refresh_token', discord_response.refresh_token, {
			secure: !dev,
			httpOnly: true,
			path: '/',
			expires: refresh_token_expires_in
		});
		console.log('======== hooks new cookies set ==================')

	}

	console.log('=========hooks end==================')

	return await resolve(event);
};
