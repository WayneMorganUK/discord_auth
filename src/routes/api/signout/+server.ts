import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals, cookies }) => {
	console.log('====================signout=======================');
	cookies.delete('disco_refresh_token', { path: '/' });
	cookies.delete('disco_access_token', { path: '/' });

	locals.disco_access_token = '';
	locals.disco_refresh_token = '';
	locals.user = null;

	console.log('redirect to / with cleared cookies');
	throw redirect(302, '/');
};
