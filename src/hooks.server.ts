import  {VITE_DISCORD_API_URL } from '$env/static/private';
import  {HOST } from '$env/static/private';

import type { Handle } from '@sveltejs/kit';


export const handle:Handle = async ({event, resolve}) =>{
  console.log("============================hooks=========================")
  const access_token = event.cookies.get("disco_access_token")
  const refresh_token = event.cookies.get("disco_refresh_token")

  console.log('access token', access_token)
  console.log('refresh token', refresh_token)


  event.locals.disco_access_token = event.cookies.get('disco_access_token') || ''
  event.locals.disco_refresh_token = event.cookies.get('disco_refresh_token') || ''
  console.log('events local', event.locals)

  // const cookies = cookie.parse(req.headers.cookie || '');
  console.log('cookies refresh',event.cookies.get('disco_refresh_token'))
  console.log('cookies access',event.cookies.get('disco_access_token')|| 'none')

  if (event.cookies.get('disco_access_token')) {
    console.log('setting discord user via access token..')
    const request = await fetch(`${VITE_DISCORD_API_URL}/users/@me`, {
      headers: { 'Authorization': `Bearer ${event.cookies.get('disco_access_token')}`}
    });

    // returns a discord user if JWT was valid
    const response = await request.json();
    console.log('hooks response', response)
    event.locals.user = response
    console.log('hooks event locals user', event.locals.user)

    // if (response.id) {
    //   return {
    //     user: {
    //       // only include properties needed client-side —
    //       // exclude anything else attached to the user
    //       // like access tokens etc
    //       ...response
    //     }
    //   }
    // }
  }
  
  return await resolve(event)
}




  // // if only refresh token is found, then access token has expired. perform a refresh on it.
  // if (cookies.disco_refresh_token && !cookies.disco_access_token) {
  //   const discord_request = await fetch(`${HOST}/api/refresh?code=${cookies.disco_refresh_token}`);
  //   const discord_response = await discord_request.json();

  //   if (discord_response.disco_access_token) {
  //     console.log('setting discord user via refresh token..')
  //     const request = await fetch(`${DISCORD_API_URL}/users/@me`, {
  //       headers: { 'Authorization': `Bearer ${discord_response.disco_access_token}` }
  //     });
  
  //     // returns a discord user if JWT was valid
  //     const response = await request.json();
  
  //     if (response.id) {
  //       return {
  //         user: {
  //           // only include properties needed client-side —
  //           // exclude anything else attached to the user
  //           // like access tokens etc
  //           ...response
  //         }
  //       }
  //     }
  //   }
  // }



  // // not authenticated, return empty user object
  // return {
  //   user: false
  // }
// }