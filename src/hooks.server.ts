import { dev } from '$app/environment';
import { DISCORD_API_URL } from '$env/static/private';
import { HOST } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('=====hooks===: Start');

	const access_token = event.cookies.get('disco_access_token') || '';
	const refresh_token = event.cookies.get('disco_refresh_token') || '';
	event.locals.disco_access_token = access_token;
	event.locals.disco_refresh_token = refresh_token;
	console.log('=====hooks===, access token :', access_token);
	console.log('=====hooks===, refresh token :', refresh_token);
	console.log('=====hooks===, event locals :', event.locals);

	if (refresh_token && access_token && event.locals.user) {
		console.log('===all good ===');
		return await resolve(event);
	}

	// if only refresh token is found, then access token has expired. perform a refresh on it.
	if (refresh_token && !access_token) {
		console.log('=====hooks====, access token expired, fetch(refresh) ==');
		const discord_request = await fetch(`${HOST}/api/refresh?code=${refresh_token}`);
		const discord_response = await discord_request.json();
		console.log('=====hooks====, refresh response :', discord_response);

		if (discord_response.access_token) {
			console.log(
				'=====hooks ==== setting new cookies and discord user via new access token..'
			);
			const access_token_expires_in = new Date(Date.now() + discord_response.expires_in); // 10 minutes
			const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

			event.cookies.set('disco_access_token', discord_response.access_token, {
				secure: !dev,
				httpOnly: true,
				path: '/',
				expires: access_token_expires_in
			});
			event.cookies.set('disco_refresh_token', discord_response.refresh_token, {
				secure: !dev,
				httpOnly: true,
				path: '/',
				expires: refresh_token_expires_in
			});
			console.log('=====hooks === , cookies set. BUT ARE THEY????');
			const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { Authorization: `Bearer ${discord_response.access_token}` }
			});

			// returns a discord user if JWT was valid
			const response = await request.json();
			console.log('=====hooks ===== new user request', response.status, response.stattusText);
			event.locals.user = response;
			console.log('=====hooks ==== set locals then return :', event.locals);

			return await resolve(event);
		}
	}
	if (access_token) {
		console.log('=====hooks ==== fetching user valid JWT, ');
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		// returns a discord user if JWT was valid
		const response = await request.json();
		console.log('=====hooks ==== valid JWT response ', response);
		event.locals.user = response;
		console.log('=====hooks ==== return');

		return await resolve(event);
	}

	// event.locals.user = {}
	return await resolve(event);
};
