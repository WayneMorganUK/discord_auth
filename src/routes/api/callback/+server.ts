import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

import { VITE_DISCORD_CLIENT_ID } from '$env/static/private'
import { VITE_DISCORD_CLIENT_SECRET } from '$env/static/private'
import { VITE_DISCORD_REDIRECT_URI } from '$env/static/private'


/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
  console.log("============================callback=========================")

  // fetch returnCode set in the URL parameters.
  const returnCode = url.searchParams.get('code');
  console.log('returnCode =>', returnCode);

  // initializing data object to be pushed to Discord's token endpoint.
  // the endpoint returns access & refresh tokens for the user.
  const dataObject = {
    client_id: VITE_DISCORD_CLIENT_ID,
    client_secret: VITE_DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: VITE_DISCORD_REDIRECT_URI,
    code: returnCode,
    scope: 'identify email guilds'
  };
  console.log('callback data object', dataObject)

  // performing a Fetch request to Discord's token endpoint
  const request = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams(dataObject),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const response = await request.json();
  console.log('call back response', response)

  // redirect to front page in case of error
  if (response.error) {
    console.log('redirect to / due error');
    throw redirect(302, '/')
  }

  // redirect user to front page with cookies set
  const access_token_expires_in = new Date(Date.now() + response.expires_in); // 10 minutes
  const refresh_token_expires_in = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  console.log('redirect to / with cookies');
  cookies.set(
    'disco_access_token', response.access_token, {
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
    expires: access_token_expires_in
  });
  cookies.set(
    'disco_refresh_token', response.refresh_token, {
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
    expires: refresh_token_expires_in
  });
  console.log('callback cookies refresh', cookies.get('disco_refresh_token'))
  console.log('callback cookies access', cookies.get('disco_access_token'))



  throw redirect(302, '/')
}