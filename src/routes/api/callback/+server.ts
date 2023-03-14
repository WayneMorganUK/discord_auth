import { error, redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '$env/static/private';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	console.log('======== callback +server start=================')

	const code = url.searchParams.get('code') as string;

	if (!code) {
		throw error(400, 'no code availabke for callback')
	}
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
	})

	if (tokenResponseData.status !== 200) {
		throw error(tokenResponseData.status, `callback request error = ${tokenResponseData.statusText} `);

	}
	const oauthData = await tokenResponseData.json();
	console.log("===========callback ouath===========", oauthData)

	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days



	cookies.set('dscrd_access_token', oauthData.access_token, {
		secure: !dev,
		httpOnly: true,
		path: '/',
		maxAge: 600
	}); // 10 minutes
	cookies.set('dscrd_refresh_token', oauthData.refresh_token, {
		secure: !dev,
		httpOnly: true,
		path: '/',
		expires: refresh_token_expires_in
	});
	console.log('======== callback +server end with cookies set=================')

	throw redirect(303, '/');
}



