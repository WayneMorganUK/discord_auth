<script lang="ts">
	import '../app.css';
	import Header from '../lib/Header.svelte';
	let { children } = $props();
</script>

<Header />
<main class="mt-8">
	{@render children()}
</main>
