<script lang="ts">
	let { info }: { info: { user: User } } = $props();
</script>

<div class="my-4 relative w-80 h-64 rounded-2xl">
	<div
		class="relative top-0 left-0 w-full h-1/3 rounded-top-2xl"
		style="background-color:{info.user?.banner_color || 'transparent'};"
	></div>
	<div class="relative bottom-0 left-0 w-full h-2/3 bg-black"></div>

	<div class="absolute top-1/2 left-4 transform -translate-y-1/2">
		<img
			class="h-24 w-24 p-1 rounded-full bg-black"
			alt="{info.user?.username ?? 'unknown'}#{info.user?.discriminator ?? '0000'} avatar"
			src={`https://cdn.discordapp.com/avatars/${info.user?.id ?? 'default'}/${info.user?.avatar ?? 'default'}.png`}
		/>
		<h4 class="text-bold">{info.user?.username ?? 'Unknown'}</h4>
		<h5 class="text-bold">{info.user?.username ?? 'Unknown'}</h5>
	</div>
</div>
