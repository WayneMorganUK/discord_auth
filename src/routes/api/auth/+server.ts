import { redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } from '$env/static/private';
import type { RequestHandler } from './$types';

const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
	DISCORD_REDIRECT_URI
)}&response_type=code&scope=email%20identify%20guilds`;

export const GET: RequestHandler = () => {
	console.log('======== auth +server start/end==================')

	throw redirect(307, DISCORD_ENDPOINT);
};
