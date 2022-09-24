import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DISCORD_CLIENT_ID } from '$env/static/private';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { DISCORD_REDIRECT_URI } from '$env/static/private';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ url, cookies }) => {
	console.log('====================callback=======================');
	// fetch returnCode set in the URL parameters.
	const returnCode = url.searchParams.get('code') as string;

	// initializing data object to be pushed to Discord's token endpoint.
	// the endpoint returns access & refresh tokens for the user.
	const dataObject: DataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: DISCORD_REDIRECT_URI,
		code: returnCode,
		scope: 'identify email guilds'
	};

	// performing a Fetch request to Discord's token endpoint
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	// redirect to front page in case of error
	if (response.error) {
		console.log('redirect to / due error');
		throw redirect(302, '/');
	}

	// redirect user to front page with cookies set
	const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
	const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
	console.log('redirect to / with cookies');
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

	throw redirect(302, '/');
};
