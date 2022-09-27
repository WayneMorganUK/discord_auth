import type { PageServerLoad } from './$types';
import { DISCORD_API_URL } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {

    const { dscrd_access_token, dscrd_refresh_token } = locals
    if (dscrd_access_token && dscrd_refresh_token) {
        const request = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${dscrd_access_token}` }
        });

        const guilds = await request.json();

        return { guilds }
    }
    return {
        locals
    }
}