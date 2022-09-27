import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	event.setHeaders({ 'Cache-Control': 'no-store' }); //  needed to use cookies.set
	// console.log('=====hooks===: Start');
	// console.log('=====hooks===, event locals :', event.locals);
	const host = event.url.origin
	console.log('======hooks url', host)
	const access_token = event.cookies.get('dscrd_access_token') || '';
	const refresh_token = event.cookies.get('dscrd_refresh_token') || '';
	event.locals.dscrd_access_token = access_token;
	event.locals.dscrd_refresh_token = refresh_token;
	console.log('=====hooks===, access token :', access_token);
	console.log('=====hooks===, refresh token :', refresh_token);

	// if only refresh token is found, then access token has expired. perform a refresh on it.
	if (refresh_token && !access_token) {
		console.log('=====hooks====, access token expired, fetch(refresh) ==');
		const discord_request = await fetch(`${host}/api/refresh?code=${refresh_token}`);
		const discord_response = await discord_request.json();
		console.log('=====hooks====, refresh response :', discord_response);

		event.locals.dscrd_access_token = discord_response.access_token;
		event.locals.dscrd_refresh_token = discord_response.refresh_token;

		console.log(
			'=====hooks ==== setting new cookies via new access token..'
		);
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
		console.log('=====hooks === , cookies set.');
	}


	return await resolve(event);
};
