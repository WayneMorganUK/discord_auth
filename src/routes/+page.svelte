<script lang="ts">
	import type { PageProps } from './$types';
	import ProfileCard from '$lib/ProfileCard.svelte';

	let { data }: PageProps = $props();
</script>

<div class="items-center flex flex-col w-full mx-auto mt-5">
	<h1 class="text-bold uppercase">Welcome to SvelteKit Discord OAuth2</h1>
	<p>
		Visit <a
			target="_blank"
			rel="external noreferrer nofollow"
			href="https://discord.com/developers/applications">Discord Developers Portal</a
		> to create a Discord Application
	</p>
	<p>
		Based on this blog post <a
			target="_blank"
			rel="external noreferrer nofollow"
			href="https://msyyn.medium.com/how-to-add-discord-oauth-to-your-sveltekit-web-application-7c2e69d7656e"
			>How to add Discord OAuth to your SvelteKit web application</a
		>
	</p>
	{#if data.user}
		<ProfileCard info={data} />
		<h5 class="mb-2">
			<span class="font-bold text-gray-300">email: </span>
			{data.user.email}
		</h5>
	{/if}
</div>
