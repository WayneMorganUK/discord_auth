<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
	<h1>{$page.status}: {$page.error?.message}</h1>
	<h2>Oops</h2>

	<a href="/">Return to the home screen</a>
</div>

<style>
	div {
		text-align: center;
		margin-bottom:64px
	}
</style>
