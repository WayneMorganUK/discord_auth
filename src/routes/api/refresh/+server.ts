import { DISCORD_CLIENT_ID } from '$env/static/private';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { DISCORD_REDIRECT_URI } from '$env/static/private';
import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies, locals }) => {
	if (locals.user?.id) {
		throw redirect(302, '/');
	}

	const dscrd_refresh_token = url.searchParams.get('code');
	const refresh_token_expires_in = new Date(Date.now() + 60 * 1000); // 1 minute
	cookies.set('test', 'refreshed_true', {
		secure: !dev,
		httpOnly: true,
		path: '/',
		expires: refresh_token_expires_in
	});

	if (!dscrd_refresh_token) {
		throw error(500, 'No refresh token found in url search params ');
	}

	// initializing data object to be pushed to Discord's token endpoint.
	// quite similar to what we set up in callback.js, expect with different grant_type.
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: dscrd_refresh_token,
		scope: 'email identify guilds'
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
	const refresh_response = await request.json();

	if (refresh_response.error) {
		throw error(500, 'No refresh token found in POST response');
	}

	return json(refresh_response);
};
