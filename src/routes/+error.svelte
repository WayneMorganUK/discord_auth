<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="text-center mb-16">
	<h1>Oops</h1>
	<h2>{page.status}: {page.error?.message}</h2>

	<a href="/">Return to the home screen</a>
</div>
