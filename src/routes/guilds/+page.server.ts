import { DISCORD_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    // Destructure the access and refresh tokens from locals
    const { discord_access_token, discord_refresh_token } = locals;

    // Check if both access and refresh tokens are available
    if (discord_access_token && discord_refresh_token) {
        // Make a request to the Discord API to get the user's guilds
        const request = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${discord_access_token}` }
        });

        // If the request fails, throw an error with the response status and status text
        if (request.status !== 200) {
            throw error(request.status, `guilds request error - ${request.statusText}`);
        }

        // Parse the response to get the guilds data
        const guilds: Guilds[] = await request.json();

        // Return the locals and guilds data
        return { locals, guilds };
    }

    // If tokens are not available, return only the locals
    return {
        locals
    };
};