import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	// Retrieve the access token from locals
	const access_token = locals.discord_access_token;

	// Make a request to the Discord API to revoke the access token
	const signOutResponse = await fetch('https://discord.com/api/oauth2/token/revoke', {
		method: 'POST',
		body: new URLSearchParams({
			client_id: DISCORD_CLIENT_ID,
			client_secret: DISCORD_CLIENT_SECRET,
			token: access_token
		}),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	// If the sign-out request fails, throw an error with the response status and status text
	if (signOutResponse.status !== 200) {
		throw error(signOutResponse.status, `signout request error = ${signOutResponse.statusText}`);
	}

	// Delete the refresh and access tokens from cookies
	cookies.delete('discord_refresh_token', { path: '/' });
	cookies.delete('discord_access_token', { path: '/' });

	// Clear the tokens and user information from locals
	locals.discord_access_token = '';
	locals.discord_refresh_token = '';
	locals.user = null;

	// Redirect the user to the home page
	throw redirect(302, '/');
};

