<script lang='ts'>
  import { page} from '$app/stores'
  console.log('==================page===============', $page)
  export let data;
  console.log('user', data.user)
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a rel="external" href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#if !data.user}
  <a rel="external" title="Discord OAuth2" href="api/auth">Authenticate via Discord</a>
{:else}
  <img alt="{data.user.userName}#{data.user.discriminator} avatar" src="https://cdn.discordapp.com/avatars/{data.user.id}/{data.user.avatar}.png">
  <h1>{data.user.username}#{data.user.discriminator}</h1>
  <a title="Sign out" href="api/signout">Sign Out</a>
{/if}