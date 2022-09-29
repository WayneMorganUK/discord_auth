import type { PageServerLoad } from './$types';
import { DISCORD_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    console.log('======== guilds +page.server start==================')


    const { dscrd_access_token, dscrd_refresh_token } = locals
    if (dscrd_access_token && dscrd_refresh_token) {
        const request = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${dscrd_access_token}` }
        });
        if (request.status !== 200) {
            throw error(request.status, `guilds request error - ${request.statusText} `)
        }

        const guilds = await request.json();
        console.log('======== guilds +page.server with guilds==================')

        return { locals, guilds }
    }
    return {
        locals
    }
}