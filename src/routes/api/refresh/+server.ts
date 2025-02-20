import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '$env/static/private';
import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	// If the user is already logged in, redirect to the home page
	if (locals.user?.id) {
		redirect(302, '/');
	}

	// Get the refresh token from the URL query parameters
	const discord_refresh_token = url.searchParams.get('code');

	// If no refresh token is found, throw an error with status 500
	if (!discord_refresh_token) {
		throw error(500, 'No refresh token found in URL search params');
	}

	// Create the data object for the token request
	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: discord_refresh_token,
		scope: 'identify email guilds'
	};

	// Perform a fetch request to Discord's token endpoint with grant type refresh token
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	// If the request fails, throw an error with the response status and status text
	if (request.status !== 200) {
		throw error(request.status, `refresh request error = ${request.statusText}`);
	}

	// Parse the response to get the refreshed tokens
	const refresh_response = await request.json();

	// Return the refreshed tokens as a JSON response
	return json(refresh_response);
};
