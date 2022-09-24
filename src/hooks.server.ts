import { DISCORD_API_URL } from '$env/static/private';
import { HOST } from '$env/static/private';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('====================hooks=======================');
	const access_token = event.cookies.get('disco_access_token') || '';
	const refresh_token = event.cookies.get('disco_refresh_token') || '';
	event.locals.disco_access_token = access_token;
	event.locals.disco_refresh_token = refresh_token;
	console.log('=== hooks event ==== ', event.locals);

	// if only refresh token is found, then access token has expired. perform a refresh on it.
	if (refresh_token && !access_token) {
		const discord_request = await fetch(`${HOST}/api/refresh?code=${refresh_token}`);
		const discord_response = await discord_request.json();

		if (discord_response.disco_access_token) {
			console.log('setting discord user via refresh token..');
			const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { Authorization: `Bearer ${discord_response.disco_access_token}` }
			});

			// returns a discord user if JWT was valid
			const response = await request.json();
			console.log('refreshed response', response);
			event.locals.user = response;

			return await resolve(event);
		}
	}
	if (access_token) {
		console.log('setting discord user via access token..');
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { Authorization: `Bearer ${access_token}` }
		});

		// returns a discord user if JWT was valid
		const response = await request.json();
		event.locals.user = response;

		return await resolve(event);
	}

	// event.locals.user = {}
	return await resolve(event);
};
