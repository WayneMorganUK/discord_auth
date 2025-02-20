import { DISCORD_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    // Initialize the user variable as null
    let user: User | null = null;

    // Check if the access and refresh tokens are available in locals
    if (locals.discord_access_token && locals.discord_refresh_token) {
        // Make a request to the Discord API to get the user's information
        const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
            headers: { Authorization: `Bearer ${locals.discord_access_token}` }
        });

        // If the request fails, throw an error with status 500
        if (request.status !== 200) {
            throw error(500, 'user request error');
        }

        // Parse the response and assign it to the user variable
        user = await request.json();
    }

    // Return the user object
    return { user };
};