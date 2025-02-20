import { error, redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '$env/static/private';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	// Get the authorization code from the URL query parameters
	const code = url.searchParams.get('code') as string;

	// If no code is available, throw an error with status 400
	if (!code) {
		throw error(400, 'no code available for callback');
	}

	// Make a request to the Discord API to exchange the authorization code for tokens
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

	// If the token request fails, throw an error with the response status and status text
	if (tokenResponseData.status !== 200) {
		throw error(tokenResponseData.status, `callback request error = ${tokenResponseData.statusText}`);
	}

	// Parse the response to get the OAuth data
	const oauthData = await tokenResponseData.json();

	// Set the access token in the cookies with a max age of 7 days
	cookies.set('discord_access_token', oauthData.access_token, {
		secure: !dev,
		httpOnly: true,
		path: '/',
		maxAge: 604800 // 7 days
	});

	// Set the refresh token in the cookies with a max age of 7 days
	cookies.set('discord_refresh_token', oauthData.refresh_token, {
		secure: !dev,
		httpOnly: true,
		path: '/',
		maxAge: 604800 // 7 days
	});

	// Redirect the user to the home page
	throw redirect(303, '/');
};



