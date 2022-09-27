import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DISCORD_CLIENT_ID } from '$env/static/private';
import { DISCORD_REDIRECT_URI } from '$env/static/private';
const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
	DISCORD_REDIRECT_URI
)}&response_type=code&scope=email%20identify%20guilds`;

export const GET: RequestHandler = () => {
	throw redirect(307, DISCORD_ENDPOINT);
};
