import { DISCORD_CLIENT_ID } from '$env/static/private';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
	const local_access_token = locals.dscrd_access_token

	const signOutResponse = await fetch('https://discord.com/api/oauth2/token/revoke', {
		method: 'POST',
		body: new URLSearchParams({
			client_id: DISCORD_CLIENT_ID,
			client_secret: DISCORD_CLIENT_SECRET,
			token: local_access_token
		}),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	if (signOutResponse.status === 200) {

		cookies.delete('dscrd_refresh_token', { path: '/' });
		cookies.delete('dscrd_access_token', { path: '/' });

		locals.dscrd_access_token = '';
		locals.dscrd_refresh_token = '';
		locals.user = null;

		throw redirect(302, '/');
	} else {
		throw redirect(302, '/');
	}
}

