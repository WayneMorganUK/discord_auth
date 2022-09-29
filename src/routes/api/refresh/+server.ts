import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } from '$env/static/private';
import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	console.log('=========refresh start==================')
	if (locals.user?.id) {
		throw redirect(302, '/');
	}

	const dscrd_refresh_token = url.searchParams.get('code');
	console.log('==refresh, discord refresh token===', dscrd_refresh_token)

	if (!dscrd_refresh_token) {
		throw error(500, 'No refresh token found in url search params ');
	}

	const dataObject = {
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: DISCORD_REDIRECT_URI,
		refresh_token: dscrd_refresh_token,
		scope: 'identify email guilds'
	};

	// performing a Fetch request to Discord's token endpoint with grant type refrsh token
	const request = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});


	if (request.status !== 200) {
		console.log('=========refresh request error==================', request)

		throw error(request.status, `refresh request error = ${request.statusText} `);

	}

	const refresh_response = await request.json();
	console.log('=========refresh end==================')


	return json(refresh_response);
};
