import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DISCORD_CLIENT_ID } from '$env/static/private';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { DISCORD_REDIRECT_URI } from '$env/static/private';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies }) => {
	// fetch 'code' set in the URL parameters.
	const code = url.searchParams.get('code') as string;
	console.log('=====callback====== start');

	if (code) {
		try {
			// performing a Fetch request to Discord's token endpoint
			try {
				const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
					method: 'POST',
					body: new URLSearchParams({
						client_id: DISCORD_CLIENT_ID,
						client_secret: DISCORD_CLIENT_SECRET,
						grant_type: 'authorization_code',
						redirect_uri: DISCORD_REDIRECT_URI,
						code: code
					}),
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				});

				const oauthData = await tokenResponseData.json();

				try {
					// const userResult = await fetch('https://discord.com/api/users/@me', {
					// 	headers: {
					// 		authorization: `${oauthData.token_type} ${oauthData.access_token}`
					// 	}
					// });

					// const user = await userResult.json();
					// user.banner_color = '#00ff00';

					const access_token_expires_in = new Date(Date.now() + oauthData.expires_in); // 10 minutes
					const refresh_token_expires_in = new Date(
						Date.now() + 30 * 24 * 60 * 60 * 1000
					); // 30 days
					const test_expires_in = new Date(Date.now() + 2 * 60 * 1000);

					cookies.set('disco_access_token', oauthData.access_token, {
						secure: !dev,
						httpOnly: true,
						path: '/',
						expires: access_token_expires_in
					});
					cookies.set('disco_refresh_token', oauthData.refresh_token, {
						secure: !dev,
						httpOnly: true,
						path: '/',
						expires: refresh_token_expires_in
					});
					cookies.set('callback', 'true', {
						secure: !dev,
						httpOnly: true,
						path: '/',
						expires: test_expires_in
					});
					console.log('======callback===== throw redirect');
					throw redirect(302, '/');
				} catch {
					console.log('redirect to / due error');
					throw redirect(302, '/');
				}
			} catch {
				console.log('redirect to / due error');
				throw redirect(302, '/');
			}
		} catch {
			console.log('redirect to / due error');
			throw redirect(302, '/');
		}
	}
	throw redirect(302, '/');
};
