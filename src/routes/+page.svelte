<script lang='ts'>
  import { user } from '$lib/stores';
  import type { PageData } from './$types';
  export let data:PageData
  $user = data.user
</script>

<div class='section'>
  <!-- <a class='link' data-sveltekit-prefetch href="/guilds">Go to Guilds</a> -->
  <a class='link' href="/guilds">Go to Guilds</a>

<h1>Welcome to SvelteKit Discord OAuth2</h1>
<p>Visit <a target='_blank' rel="external nofollow" href="https://discord.com/developers/applications">Discord Developers Portal</a> to create a Discord Application</p>
<p>Based on this blog post <a target='_blank' rel="external nofollow" href='https://msyyn.medium.com/how-to-add-discord-oauth-to-your-sveltekit-web-application-7c2e69d7656e'>How to add Discord OAuth to your SvelteKit web application</a></p>
{#if !data.user}
  <a rel="external" title="Discord OAuth2" href="api/auth">Authenticate via Discord</a>
{:else}
  <img style='background-color:{data.user.banner_color};' alt="{data.user.username}#{data.user.discriminator} avatar" src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.user.avatar}.png">
  <h1>{data.user.username}#{data.user.discriminator}</h1>
  <h2>email: {data.user.email}</h2>
  <a rel='external' title="Sign out" href="api/signout">Sign Out</a> 
  <!-- rel='external' causes error in signout if missing -->

  <!-- <pre>{JSON.stringify(data.user , null, 2)}</pre> -->
{/if}
</div>
<style>
    .link {
    font-size: 32px;
  }
  .section {
    align-items: center;
    display:flex;
    flex-direction:column;
    width:100%;
    margin-left:auto;
    margin-right:auto;
  }
  img {
    height:200px;
    width:  200px;
    padding: 5px;

  }
</style>