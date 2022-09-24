import { DISCORD_CLIENT_ID } from '$env/static/private';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { DISCORD_REDIRECT_URI } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies }) => {
	console.log('====================refresh=======================');
	const disco_refresh_token = url.searchParams.get('code');
	console.log('refresh disco refreshh token from search params', disco_refresh_token);

	if (!disco_refresh_token) {
		throw error(500, 'No refresh token found in url search params ');
	}

	// initializing data object to be pushed to Discord's token endpoint.
	// quite similar to what we set up in callback.js, expect with different grant_type.
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: disco_refresh_token,
		scope: 'identify email guilds'
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
	console.log('refresh request', request);
	const response = await request.json();
	console.log('refresh response  access token', response.access_token);
	if (response.error) {
		throw error(500, 'No refresh token found in POST response');
	}

	// redirect user to front page with cookies set
	const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	console.log('set refreshed cookies');
	cookies.set('disco_access_token', response.access_token, {
		secure: !dev,
		httpOnly: true,
		path: '/',
		expires: access_token_expires_in
	});
	cookies.set('disco_refresh_token', response.refresh_token, {
		secure: !dev,
		httpOnly: true,
		path: '/',
		expires: refresh_token_expires_in
	});

	return new Response(JSON.stringify({ disco_access_token: response.access_token }));
};
