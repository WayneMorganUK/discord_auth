<script lang="ts">
	// import ProfileCard from '$lib/ProfileCard.svelte';
	import type { PageData } from './$types.js';

	let { data } = $props();

	function sortObjects(arr: Guild[]) {
		const mainTopics = [];
		const subTopics: { [key: string]: any[] } = {};

		// Separate main topics (no parent_id) and subtopics (with parent_id)
		for (const item of arr) {
			if (item.parent_id === null) {
				mainTopics.push(item);
			} else {
				if (!subTopics[item.parent_id]) {
					subTopics[item.parent_id] = [];
				}
				subTopics[item.parent_id].push(item);
			}
		}

		// Sort main topics by position
		mainTopics.sort((a, b) => a.position - b.position);

		// Sort subtopics by position within their parent
		for (const parentId in subTopics) {
			subTopics[parentId].sort((a, b) => a.position - b.position);
		}

		const sortedArray = [];

		// Combine main topics and their subtopics in the correct order
		for (const mainTopic of mainTopics) {
			sortedArray.push(mainTopic);
			if (subTopics[mainTopic.id]) {
				sortedArray.push(...subTopics[mainTopic.id]);
			}
		}

		return sortedArray;
	}
	let sortedData: Guild[] = $state([]);
	if (data.guild) {
		sortedData = sortObjects(data.guild);
	}
</script>

<div class="items-left flex max-w-2/3 flex-col w-full mx-auto mb-4">
	{#if sortedData.length > 0}
		{#each sortedData as guild}
			<div class="">
				{#if guild.parent_id === null}
					<!-- <p class="text-white text-2xl text-left">{guild?.icon_emoji?.name}</p> -->
					<p class="text-white text-2xl">{guild.name}</p>
				{:else}
					<p class="text-cyan-200 ml-4">{guild?.icon_emoji?.name} {guild.name}</p>
				{/if}
				<p class="whitespace-pre-wrap ml-12">{guild.topic}</p>
			</div>
		{/each}
	{/if}
</div>
