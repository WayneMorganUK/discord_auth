import type { LayoutServerLoad } from './$types';
import { dev } from '$app/environment';
import { DISCORD_API_URL } from '$env/static/private';

export const load: LayoutServerLoad = async ({ url, locals, cookies }) => {
	let user = null

	const { dscrd_access_token, dscrd_refresh_token } = locals
	if (dscrd_access_token && dscrd_refresh_token) {
		const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
			headers: { Authorization: `Bearer ${dscrd_access_token}` }
		});

		user = await request.json();
		return { user }
	} else {

		if (!dscrd_access_token && dscrd_refresh_token) {
			const discord_request = await fetch(`${url.origin}/api/refresh?code=${dscrd_refresh_token}`);
			const oauthData = await discord_request.json();
			locals.dscrd_access_token = oauthData.access_token
			locals.dscrd_refresh_token = oauthData.refresh_token

			const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
				headers: { Authorization: `Bearer ${oauthData.access_token}` }
			});
			user = await request.json();

			const refresh_token_expires_in = new Date(
				Date.now() + 30 * 24 * 60 * 60 * 1000
			); // 30 days

			cookies.set('dscrd_access_token', oauthData.access_token, {
				secure: !dev,
				httpOnly: true,
				path: '/',
				maxAge: 600
			});
			cookies.set('dscrd_refresh_token', oauthData.refresh_token, {
				secure: !dev,
				httpOnly: true,
				path: '/',
				expires: refresh_token_expires_in
			});
			return { user }
		}
	}
}

