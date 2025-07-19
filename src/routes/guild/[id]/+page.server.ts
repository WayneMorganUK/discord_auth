import { DISCORD_API_URL } from '$env/static/private';
import { DISCORD_BOT_TOKEN } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, params }) => {
    // Destructure the access and refresh tokens from locals
    const { discord_access_token, discord_refresh_token } = locals;

    // Check if both access and refresh tokens are available
    if (discord_access_token && discord_refresh_token) {
        // Make a request to the Discord API to get the user's guilds
        const request = await fetch(`${DISCORD_API_URL}/guilds/${params.id}/channels`, {
            headers: {
                Authorization: `Bot ${DISCORD_BOT_TOKEN}`,

            }
        });

        // If the request fails, throw an error with the response status and status text
        if (request.status !== 200) {
            throw error(request.status, `guilds request error - ${request.statusText}`);
        }

        // Parse the response to get the guilds data
        const guild: Guild[] = await request.json();

        // Return the locals and guilds data
        return { locals, guild };
    }

    // If tokens are not available, return only the locals
    return {
        locals
    };
};