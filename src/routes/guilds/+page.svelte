<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { page } from'$app/stores'
</script>

<div class="section">
	<!-- <a class='link' data-sveltekit-prefetch href="/">Home</a> -->
	<a class="link" href="/">Home</a>
	{#if !$page.data.user}
		<a rel="external" title="Discord OAuth2" href="api/auth">Authenticate via Discord</a>
	{:else}
		<img
			style="background-color:{$page.data.user.banner_color};"
			alt="{$page.data.user.username}#{$page.data.user.discriminator} avatar"
			src="https://cdn.discordapp.com/avatars/{$page.data.user.id}/{$page.data.user.avatar}.png"
		/>
		<h1>{$page.data.user.username}#{$page.data.user.discriminator}</h1>

		{#if data.guilds.message}
			<p>{data.guilds.message}</p>
		{:else}
			<ul>
				{#each data.guilds as guild}
					<div class="list">
						<img
							class="icon"
							src="https://cdn.discordapp.com/icons/{guild.id}/{guild.icon}.png"
							alt=" "
							aria-hidden="true"
						/>
						<li>{guild.name}</li>
					</div>
				{/each}
			</ul>
		{/if}
	{/if}
</div>

<style>
	.icon {
		height: 20px;
		width: 20px;
	}
	.list {
		display: flex;
		flex-direction: row;
	}
	.link {
		font-size: 32px;
		padding-bottom: 30px;
	}
	.section {
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}
	li {
		list-style: none;
	}
	img {
		height: 125px;
		width: 125px;
		padding: 7px;
		border-radius: 100%;
	}
</style>
