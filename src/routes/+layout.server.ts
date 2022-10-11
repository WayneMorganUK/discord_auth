import type { LayoutServerLoad } from './$types';
import { DISCORD_API_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
    console.log('======== +page.server start==================')

    let user = null

    if (locals.dscrd_access_token && locals.dscrd_refresh_token) {
        const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
            headers: { Authorization: `Bearer ${locals.dscrd_access_token}` }
        });

        if (request.status !== 200) {
            throw error(500, 'user request error')
        }

        user = await request.json();
        console.log('======== +page.server end with user ==================')
    }
    return { user }
}