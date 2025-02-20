import { redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } from '$env/static/private';
import type { RequestHandler } from './$types';

// Construct the Discord OAuth2 authorization endpoint URL
const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
	DISCORD_REDIRECT_URI
)}&response_type=code&scope=email%20identify%20guilds`;

// Define the GET request handler
export const GET: RequestHandler = () => {
	// Redirect the user to the Discord OAuth2 authorization endpoint
	redirect(307, DISCORD_ENDPOINT);
};