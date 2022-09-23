import { error, redirect } from '@sveltejs/kit';
import { VITE_DISCORD_CLIENT_ID } from '$env/static/private';
import { VITE_DISCORD_REDIRECT_URI } from '$env/static/private';
const DISCORD_ENDPOINT = `https://discord.com/api/oauth2/authorize?client_id=${VITE_DISCORD_CLIENT_ID}&redirect_uri=${VITE_DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20email%20guilds`;

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET() {
  console.log("============================auth=========================")
  throw redirect(307, DISCORD_ENDPOINT)
}
