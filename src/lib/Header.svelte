<script lang="ts">
	import { page } from '$app/state';
</script>

{#if !page.data.user}
	<div class="flex flex-row justify-center">
		<a
			class="text-2xl uppercase text-bold"
			rel="external"
			title="Discord OAuth2"
			href="api/auth">Authenticate via Discord</a
		>
	</div>
{:else}
	<div class="flex flex-row gap-4 justify-center">
		<a class="text-2xl uppercase text-bold" href="/">Home</a>
		<a class="text-2xl uppercase text-bold" href="/guilds">Guilds</a>
		<a class="text-2xl uppercase text-bold" rel="external" title="Sign out" href="api/signout"
			>Sign Out</a
		>
	</div>
{/if}
