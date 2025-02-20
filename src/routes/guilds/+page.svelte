<script lang="ts">
	import ProfileCard from '$lib/ProfileCard.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div class="items-center flex flex-col w-full mx-auto">
	{#if data.user}
		<ProfileCard info={data} />

		{#if data.guilds}
			<div class="flex justify-center">
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
					{#each data.guilds as guild}
						<div class="flex items-center">
							<img
								class="w-10 h-10 rounded-full mr-2 p-1"
								src="https://cdn.discordapp.com/icons/{guild.id}/{guild.icon}.png"
								alt=" "
								aria-hidden="true"
							/>
							<li class="text-gray-100 list-none">{guild.name}</li>
						</div>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}
</div>
