import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals, cookies }) => {
	console.log('====================signout=======================');
	// 	POST https://discord.com/api/oauth2/token/revoke
	// Content-Type: application/x-www-form-urlencoded
	// data:
	//   client_id: <client_id>
	//   client_secret: <client_secret>
	//   token: <access_token>
	cookies.delete('disco_refresh_token', { path: '/' });
	cookies.delete('disco_access_token', { path: '/' });

	locals.disco_access_token = '';
	locals.disco_refresh_token = '';
	locals.user = null;

	console.log('redirect to / with cleared cookies');
	throw redirect(302, '/');
};
